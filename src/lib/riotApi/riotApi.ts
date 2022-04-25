import Axios from "axios";
import { env } from "../../env";
import { LeagueEntryDto, MatchDto, PLATFORM, SummonerDto } from "./types";

const platformToRegion: Record<PLATFORM, string> = {
  [PLATFORM.EUN1]: "EUROPE",
  [PLATFORM.EUW1]: "EUROPE",
};

const riotAxiosClient = Axios.create({
  headers: {
    "X-Riot-Token": env.RIOT_API_KEY,
  },
});

export async function getSummonerData(
  summonerName: string,
  summonerPlatform: PLATFORM
) {
  const summonerData = await riotAxiosClient.get<SummonerDto>(
    `https://${summonerPlatform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
  );
  return summonerData.data;
}

export async function getSummonerLeagueEntries(
  summonerName: string,
  summonerPlatform: PLATFORM
) {
  const { id } = await getSummonerData(summonerName, summonerPlatform);
  const leagueEntry = await riotAxiosClient.get<LeagueEntryDto[]>(
    `https://${summonerPlatform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`
  );

  return leagueEntry.data;
}

export async function getSummonerMatchEntries(
  summonerPuuid: string,
  summonerPlatform: PLATFORM,
  startTime: number,
  endTime: number
) {
  const matchesIds = await riotAxiosClient.get<string[]>(
    `https://${platformToRegion[summonerPlatform]}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerPuuid}/ids?startTime=${startTime}&endTime=${endTime}`
  );

  return matchesIds.data;
}

export async function getMatchInfo(
  summonerPlatform: PLATFORM,
  matchId: string
) {
  const matchInfo = await riotAxiosClient.get<MatchDto>(
    `https://${platformToRegion[summonerPlatform]}.api.riotgames.com/lol/match/v5/matches/${matchId}`
  );
  return matchInfo.data;
}
