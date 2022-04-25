import { PLATFORM, LeagueEntryDto } from "../../lib/riotApi/types";

const platformToOpggRegion: Record<PLATFORM, string> = {
  [PLATFORM.EUN1]: "eune",
  [PLATFORM.EUW1]: "euw",
};

const platformToCommonName: Record<PLATFORM, string> = {
  [PLATFORM.EUN1]: "EUNE",
  [PLATFORM.EUW1]: "EUW",
};

export function createOpggLink(
  summonerName: string,
  summonerPlatform: PLATFORM
) {
  return `https://op.gg/summoners/${platformToOpggRegion[summonerPlatform]}/${summonerName}`;
}

export function rankMessageFormatter(
  summonerLeagueInfo: (LeagueEntryDto & { platform: PLATFORM })[]
) {
  return summonerLeagueInfo
    .map((summonerLeagueInfo) => {
      return `${platformToCommonName[summonerLeagueInfo.platform]} ${
        summonerLeagueInfo.summonerName
      }: ${summonerLeagueInfo.tier} ${summonerLeagueInfo.rank} ${
        summonerLeagueInfo.leaguePoints
      } LP ${Math.trunc(
        (summonerLeagueInfo.wins /
          (summonerLeagueInfo.wins + summonerLeagueInfo.losses)) *
          100
      )}% WR ${createOpggLink(
        summonerLeagueInfo.summonerName,
        summonerLeagueInfo.platform
      )}`;
    })
    .join(" | ");
}
