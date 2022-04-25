import { MatchStats } from "./types";

export function statsMessageFormatter(matches: MatchStats[]) {
  if (matches.length <= 0) {
    return "Nie zostały rozegrane żadne mecze.";
  }
  const matchesCount = matches.length;
  const winLooseRatio = matches.reduce(
    (prev, curr) => {
      if (curr.win) {
        prev.wins += 1;
      } else {
        prev.looses += 1;
      }
      return prev;
    },
    { wins: 0, looses: 0 }
  );
  const winLooseRatioMessage = `Bilans [W-L]: ${winLooseRatio.wins}:${winLooseRatio.looses}.`;
  const matchStatsMessages = matches.map((match) => {
    const icon = match.win ? "✔" : "✖";
    return `${match.championName} ${icon} ${match.kda.kills}/${match.kda.deaths}/${match.kda.assists}`;
  });
  const todaysKda = matches.reduce(
    (prev, curr) => {
      prev.kills += curr.kda.kills;
      prev.deaths += curr.kda.deaths;
      prev.assists += curr.kda.assists;
      return prev;
    },
    { kills: 0, deaths: 0, assists: 0 }
  );
  return `${winLooseRatioMessage} ${matchStatsMessages.join(
    "; "
  )}. Dzisiejsze KDA: ${todaysKda.kills}/${todaysKda.deaths}/${
    todaysKda.assists
  } (${((todaysKda.kills + todaysKda.assists) / todaysKda.kills).toFixed(
    2
  )}). Średnie KDA: ${(todaysKda.kills / matchesCount).toFixed(2)}/${(
    todaysKda.deaths / matchesCount
  ).toFixed(2)}/${(todaysKda.assists / matchesCount).toFixed(2)}`;
}
