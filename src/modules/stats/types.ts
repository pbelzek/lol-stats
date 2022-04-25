export interface MatchStats {
  kda: {
    kills: number;
    deaths: number;
    assists: number;
  };
  win: boolean;
  championName: string;
}
