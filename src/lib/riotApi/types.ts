export interface SummonerDto {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
}

export interface LeagueEntryDto {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface ParticipantDto {
  kills: number;
  assists: number;
  deaths: number;
  championName: string;
  teamId: number;
}

export interface TeamDto {
  teamId: number;
  win: boolean;
}

export interface MatchMetadataDto {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface MatchInfoDto {
  participants: ParticipantDto[];
  teams: TeamDto[];
  queueId: QUEUE_ID;
}
export interface MatchDto {
  metadata: MatchMetadataDto;
  info: MatchInfoDto;
}

export enum PLATFORM {
  EUN1 = "EUN1",
  EUW1 = "EUW1",
}

export enum REGION {
  EUROPE = "EUROPE",
}

export enum QUEUE_ID {
  RANKED = 420,
  DRAFT = 400,
}
