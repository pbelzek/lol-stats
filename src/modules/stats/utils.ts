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

export function parseStreamUptimeString(streamUptimeString: string): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  let hoursValue = 0;
  let minutesValue = 0;
  let secondsValue = 0;
  const hoursExpressions = ["hours", "hour"];
  const minutesExpressions = ["mins", "min"];
  const secondsExpressions = ["secs", "sec"];
  const keyStreamUptimeStringExpressions = [
    ...hoursExpressions,
    ...minutesExpressions,
    ...secondsExpressions,
  ];
  // check if streamUptimeString includes at least one of the key expressions;
  const isValidStreamUptimeString = keyStreamUptimeStringExpressions.some(
    (el) => streamUptimeString.includes(el)
  );
  if (!isValidStreamUptimeString) {
    throw new Error("Invalid stream uptime");
  }

  const splitStreamUptimeString = streamUptimeString.split(" ");

  // Hours
  const hoursExpressionIndex = splitStreamUptimeString.findIndex((el) =>
    hoursExpressions.some((expression) => expression === el)
  );
  if (hoursExpressionIndex >= 0) {
    hoursValue = Number(splitStreamUptimeString[hoursExpressionIndex - 1] ?? 0);
  }

  // Minutes
  const minutesExpressionIndex = splitStreamUptimeString.findIndex((el) =>
    minutesExpressions.some((expression) => expression === el)
  );
  if (minutesExpressionIndex >= 0) {
    minutesValue = Number(
      splitStreamUptimeString[minutesExpressionIndex - 1] ?? 0
    );
  }
  // Seconds
  const secondsExpressionIndex = splitStreamUptimeString.findIndex((el) =>
    secondsExpressions.some((expression) => expression === el)
  );
  if (secondsExpressionIndex >= 0) {
    secondsValue = Number(
      splitStreamUptimeString[secondsExpressionIndex - 1] ?? 0
    );
  }

  return {
    hours: hoursValue,
    minutes: minutesValue,
    seconds: secondsValue,
  };
}
