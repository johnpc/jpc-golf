import getHandicap from "./getHandicap";
import getHighHandicap from "./getHighHandicap";
import getLowHandicap from "./getLowHandicap";
import {FIRST_MATCH_DATE, MS_PER_WEEK} from "./setMatchSchedule";
const HANDICAP_ESTABLISHMENT_WEEKS = 2;

const parseMatchData = (match) => {
  const isHandicapEstablishmentMatch =
    Date.parse(match.date) <
    Date.parse(FIRST_MATCH_DATE) + MS_PER_WEEK * HANDICAP_ESTABLISHMENT_WEEKS;

  const homeLowHandicapPlayer = getLowHandicap(
    match.homeTeam?.players.items,
    match.date
  );
  const homeHighHandicapPlayer = getHighHandicap(
    match.homeTeam?.players.items,
    match.date
  );
  const awayLowHandicapPlayer = getLowHandicap(
    match.awayTeam?.players.items,
    match.date
  );
  const awayHighHandicapPlayer = getHighHandicap(
    match.awayTeam?.players.items,
    match.date
  );

  const homeLowHandicap = getHandicap(homeLowHandicapPlayer, match.date);
  const awayLowHandicap = getHandicap(awayLowHandicapPlayer, match.date);
  const homeHighHandicap = getHandicap(homeHighHandicapPlayer, match.date);
  const awayHighHandicap = getHandicap(awayHighHandicapPlayer, match.date);

  const homeLowRawScore = parseInt(
    match.scores.items.find(
      (score) => score.player.id === homeLowHandicapPlayer.id
    )?.score
  );

  const homeHighRawScore = parseInt(
    match.scores.items.find(
      (score) => score.player?.id === homeHighHandicapPlayer?.id
    )?.score
  );

  const awayLowRawScore = parseInt(
    match.scores.items.find(
      (score) => score.player?.id === awayLowHandicapPlayer?.id
    )?.score
  );

  const awayHighRawScore = parseInt(
    match.scores.items.find(
      (score) => score.player?.id === awayHighHandicapPlayer?.id
    )?.score
  );

  const homeLowAdjScore = parseFloat(
    (homeLowRawScore - homeLowHandicap).toFixed(2)
  );
  const homeHighAdjScore = parseFloat(
    (homeHighRawScore - homeHighHandicap).toFixed(2)
  );
  const awayLowAdjScore = parseFloat(
    (awayLowRawScore - awayLowHandicap).toFixed(2)
  );
  const awayHighAdjScore = parseFloat(
    (awayHighRawScore - awayHighHandicap).toFixed(2)
  );

  const data = [
    {
      homeTeamId: match.homeTeam?.id,
      homeName: match.homeTeam?.name ?? "No opponent",
      homeHandicap: homeLowHandicap + homeHighHandicap,
      homeRaw: getScore(homeLowRawScore + homeHighRawScore),
      homeAdj: getScore(homeLowAdjScore + homeHighAdjScore),
      vs: getVs(
        isHandicapEstablishmentMatch,
        homeHighAdjScore + homeLowAdjScore,
        awayHighAdjScore + awayLowAdjScore,
        [
          homeHighHandicapPlayer,
          awayHighHandicapPlayer,
          homeLowHandicapPlayer,
          awayLowHandicapPlayer,
        ],
        match
      ),
      vsWithDifference: getVsWithDifference(
        isHandicapEstablishmentMatch,
        homeHighAdjScore + homeLowAdjScore,
        awayHighAdjScore + awayLowAdjScore,
        [
          homeHighHandicapPlayer,
          awayHighHandicapPlayer,
          homeLowHandicapPlayer,
          awayLowHandicapPlayer,
        ],
        match
      ),
      awayTeamId: match.awayTeam?.id,
      awayName: match.awayTeam?.name,
      awayHandicap: awayLowHandicap + awayHighHandicap,
      awayRaw: getScore(awayLowRawScore + awayHighRawScore),
      awayAdj: getScore(awayLowAdjScore + awayHighAdjScore),
      matchDate: match.date,
      key: `${match.id}Team`,
    },
    {
      homePlayerId: homeLowHandicapPlayer?.id,
      homeName: homeLowHandicapPlayer?.name,
      homeHandicap: homeLowHandicap,
      homeRaw: getScore(homeLowRawScore),
      homeAdj: getScore(homeLowAdjScore),
      vs: getVs(
        isHandicapEstablishmentMatch,
        homeLowAdjScore,
        awayLowAdjScore,
        [homeLowHandicapPlayer, awayLowHandicapPlayer],
        match
      ),
      vsWithDifference: getVsWithDifference(
        isHandicapEstablishmentMatch,
        homeLowAdjScore,
        awayLowAdjScore,
        [homeLowHandicapPlayer, awayLowHandicapPlayer],
        match
      ),
      awayPlayerId: awayLowHandicapPlayer?.id,
      awayName: awayLowHandicapPlayer?.name,
      awayHandicap: awayLowHandicap,
      awayRaw: getScore(awayLowRawScore),
      awayAdj: getScore(awayLowAdjScore),
      matchDate: match.date,
      key: `${match.id}LowHandicap`,
    },
    {
      homePlayerId: homeHighHandicapPlayer?.id,
      homeName: homeHighHandicapPlayer?.name,
      homeHandicap: homeHighHandicap,
      homeRaw: getScore(homeHighRawScore),
      homeAdj: getScore(homeHighAdjScore),
      vs: getVs(
        isHandicapEstablishmentMatch,
        homeHighAdjScore,
        awayHighAdjScore,
        [homeHighHandicapPlayer, awayHighHandicapPlayer],
        match
      ),
      vsWithDifference: getVsWithDifference(
        isHandicapEstablishmentMatch,
        homeHighAdjScore,
        awayHighAdjScore,
        [homeHighHandicapPlayer, awayHighHandicapPlayer],
        match
      ),
      awayPlayerId: awayHighHandicapPlayer?.id,
      awayName: awayHighHandicapPlayer?.name,
      awayHandicap: awayHighHandicap,
      awayRaw: getScore(awayHighRawScore),
      awayAdj: getScore(awayHighAdjScore),
      matchDate: match.date,
      key: `${match.id}HighHandicap`,
    },
  ];
  return data;
};

function getScore(score) {
  return !Number.isNaN(score) ? score : "TBD";
}

function getVsWithDifference(
  isHandicapEstablishmentMatch,
  homeAdjScore,
  awayAdjScore,
  players,
  match
) {
  let scoreDifference = parseFloat((homeAdjScore - awayAdjScore).toFixed(2));
  if (Number.isNaN(scoreDifference)) {
    scoreDifference = "default";
  } else {
    scoreDifference = Math.abs(scoreDifference);
  }

  const vs = getVs(
    isHandicapEstablishmentMatch,
    homeAdjScore,
    awayAdjScore,
    players,
    match
  );
  const isTie = ["=", "-"].includes(vs);
  if (isTie) return vs;
  return `${vs} by ${scoreDifference}`;
}

function getVs(
  isHandicapEstablishmentMatch,
  homeAdjScore,
  awayAdjScore,
  players,
  match
) {
  if (isHandicapEstablishmentMatch || players.some((player) => !player) || Date.parse(match.date) > Date.now()) {
    return "-";
  }

  if (homeAdjScore === awayAdjScore) {
    return "=";
  }

  if (Number.isNaN(homeAdjScore) || homeAdjScore > awayAdjScore) {
    return "➡️";
  }

  if (Number.isNaN(awayAdjScore) || homeAdjScore < awayAdjScore) {
    return "⬅️";
  }

  return "🤷‍♂️";
}

export default parseMatchData;
