import { FastifyInstance } from "fastify";
import subHours from "date-fns/subHours";
import subMinutes from "date-fns/subMinutes";
import getUnixTime from "date-fns/getUnixTime";
import { subSeconds } from "date-fns";
import {
  getMatchInfo,
  getSummonerData,
  getSummonerMatchEntries,
} from "../../lib/riotApi/riotApi";
import { PLATFORM, QUEUE_ID } from "../../lib/riotApi/types";
import { createSummonerToPlatformMap, toArray } from "../utils";
import { MatchStats } from "./types";
import { parseStreamUptimeString, statsMessageFormatter } from "./utils";

interface StatsRouteQuerystring {
  "summoner-name": string | string[];
  "summoner-platform": string | string[];
  "stream-uptime": string;
}

const registerStatsController = (app: FastifyInstance) => () => {
  app.route<{
    Querystring: StatsRouteQuerystring;
  }>({
    method: "GET",
    url: "/stats",
    schema: {
      querystring: {
        type: "object",
        properties: {
          ["summoner-name"]: { type: ["string", "array"] },
          ["summoner-platform"]: { type: ["string", "array"] },
          ["stream-uptime"]: { type: "string" },
        },
        required: ["summoner-name", "summoner-platform", "stream-uptime"],
      },
    },
    handler: async (req, reply) => {
      const summonerNames = toArray(req.query["summoner-name"]);
      const summonerPlatforms = toArray(req.query["summoner-platform"]);
      const streamUptime = req.query["stream-uptime"];

      const summonerNamePlatformMap = createSummonerToPlatformMap(
        summonerNames,
        summonerPlatforms
      );

      // TODO: Validate lengths of names and platform arrays;
      if (summonerNames.length !== summonerPlatforms.length) {
        throw new Error("Invalid params");
      }

      const streamUptimeValues = parseStreamUptimeString(streamUptime);

      const endTime = Date.now();
      const startTime = getUnixTime(
        subSeconds(
          subMinutes(
            subHours(endTime, streamUptimeValues.hours),
            streamUptimeValues.minutes
          ),
          streamUptimeValues.seconds
        )
      );

      // Get an array of arrays of summoner's matches
      const summonerMatchStatsArrays = await Promise.all(
        summonerNames.map(async (summonerName) => {
          const summonerPlatform = summonerNamePlatformMap[
            summonerName
          ] as PLATFORM;
          // For each summoner name get data about it
          const summonerData = await getSummonerData(
            summonerName,
            summonerPlatform
          );
          // Get list of matches ids for given summoner
          const matchesIds = await getSummonerMatchEntries(
            summonerData.puuid,
            summonerPlatform,
            startTime,
            endTime
          );
          // Get detailed info about each match
          const matchesData = await Promise.all(
            matchesIds.map(async (matchId) => {
              return await getMatchInfo(summonerPlatform, matchId);
            })
          );
          // Pick only ranked matches
          const rankedMatchesData = matchesData.filter(
            (match) => match.info.queueId === QUEUE_ID.RANKED
          );

          // From each match we have to pick KDA, win/loose and champion selected;
          const matchesStats: MatchStats[] = rankedMatchesData.map(
            (matchData) => {
              const summonerParticipantsListIndex =
                matchData.metadata.participants.findIndex(
                  (participantId) => participantId === summonerData.puuid
                );
              const summonerParticipantInfo =
                matchData.info.participants[summonerParticipantsListIndex];
              if (!summonerParticipantInfo) {
                throw new Error("Invalid match info");
              }

              const kda = {
                kills: summonerParticipantInfo.kills,
                deaths: summonerParticipantInfo.deaths,
                assists: summonerParticipantInfo.assists,
              };

              const summonerTeam = matchData.info.teams.find(
                (team) => team.teamId === summonerParticipantInfo.teamId
              );

              if (!summonerTeam) {
                throw new Error("Invalid match info");
              }

              const matchWon = summonerTeam.win;

              return {
                championName: summonerParticipantInfo.championName,
                kda,
                win: matchWon,
              };
            }
          );

          return matchesStats;
        })
      );

      // Flatten nested match arrays
      const allSummonersMatchesStats = summonerMatchStatsArrays.flat(2);

      if (allSummonersMatchesStats.length <= 0) {
        return reply.status(200).send("Nie zostały rozegrane żadne mecze.");
      }

      const formattedMessage = statsMessageFormatter(allSummonersMatchesStats);

      return reply.status(200).send(formattedMessage);
    },
  });
};

export { registerStatsController };
