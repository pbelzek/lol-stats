import { PLATFORM } from "../lib/riotApi/types";

export function createSummonerToPlatformMap(
  summonerNames: string[],
  summonerPlatforms: string[]
) {
  return summonerNames.reduce((prev, curr, index) => {
    prev[curr] = summonerPlatforms[index] as PLATFORM;
    return prev;
  }, {} as Record<string, PLATFORM>);
}

export function toArray<T>(value: T | T[]) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}
