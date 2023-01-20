import { FastifyInstance } from "fastify";
import { getSummonerLeagueEntries } from "../../lib/riotApi/riotApi";
import { PLATFORM } from "../../lib/riotApi/types";
import { rankMessageFormatter } from "./utils";
interface RankRouteQuerystring {
  "summoner-name": string | string[];
  "summoner-platform": string | string[];
}

const registerRankController = (app: FastifyInstance) => () => {
  app.route<{
    Querystring: RankRouteQuerystring;
  }>({
    method: "GET",
    url: "/rank",
    schema: {
      querystring: {
        type: "object",
        properties: {
          ["summoner-name"]: { type: ["string", "array"] },
          ["summoner-platform"]: { type: ["string", "array"] },
        },
        required: ["summoner-name", "summoner-platform"],
      },
    },
    handler: async (req, reply) => {
      const summonerNames = req.query["summoner-name"];
      const summonerPlatforms = req.query["summoner-platform"];
      // TODO: Validate lengths of names and platform arrays;
      let summonerNamePlatformMap: Record<string, PLATFORM> = {};
      const promises = [];
      if (Array.isArray(summonerNames)) {
        summonerNamePlatformMap = summonerNames.reduce((prev, curr, index) => {
          prev[curr] = summonerPlatforms[index] as PLATFORM;
          return prev;
        }, {} as Record<string, PLATFORM>);
        summonerNames.map((summonerName, index) => {
          const platform =
            (summonerPlatforms[index] as PLATFORM) || PLATFORM.EUN1;
          promises.push(getSummonerLeagueEntries(summonerName, platform));
        });
      } else {
        promises.push(
          getSummonerLeagueEntries(summonerNames, summonerPlatforms as PLATFORM)
        );
      }
      const results = await Promise.allSettled(promises);
      const allSummonersLeagues = results.map((result) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
      });

      // Pick only ranked leagues
      const rankedLeagues = allSummonersLeagues
        .reduce((prev, curr) => {
          if (curr) {
            const rankedLeague = curr.find(
              (league) => league.queueType === "RANKED_SOLO_5x5"
            );
            if (rankedLeague) {
              prev?.push(rankedLeague);
              return prev;
            }
          }
          return prev;
        }, [])
        ?.map((league) => ({
          ...league,
          platform: summonerNamePlatformMap[league.summonerName] as PLATFORM,
        }));
      if (rankedLeagues) {
        return reply.status(200).send(rankMessageFormatter(rankedLeagues));
      }
      return reply.status(200).send("");
    },
  });
};

export { registerRankController };
