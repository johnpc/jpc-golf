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

  const homeLowAdjScore = homeLowRawScore + homeLowHandicap;
  const homeHighAdjScore = homeHighRawScore + homeHighHandicap;
  const awayLowAdjScore = awayLowRawScore + awayLowHandicap;
  const awayHighAdjScore = awayHighRawScore + awayHighHandicap;

  const data = [
    {
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
        ]
      ),
      awayName: match.awayTeam?.name,
      awayHandicap: awayLowHandicap + awayHighHandicap,
      awayRaw: getScore(awayLowRawScore + awayHighRawScore),
      awayAdj: getScore(awayLowAdjScore + awayHighAdjScore),
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
        [homeLowHandicapPlayer, awayLowHandicapPlayer]
      ),
      awayPlayerId: awayLowHandicapPlayer?.id,
      awayName: awayLowHandicapPlayer?.name,
      awayHandicap: awayLowHandicap,
      awayRaw: getScore(awayLowRawScore),
      awayAdj: getScore(awayLowAdjScore),
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
        [homeHighHandicapPlayer, awayHighHandicapPlayer]
      ),
      awayPlayerId: awayHighHandicapPlayer?.id,
      awayName: awayHighHandicapPlayer?.name,
      awayHandicap: awayHighHandicap,
      awayRaw: getScore(awayHighRawScore),
      awayAdj: getScore(awayHighAdjScore),
      key: `${match.id}HighHandicap`,
    },
  ];
  return data;
};

function getScore(score) {
  return !Number.isNaN(score) ? score : "TBD";
}

function getVs(
  isHandicapEstablishmentMatch,
  homeAdjScore,
  awayAdjScore,
  players
) {
  return !isHandicapEstablishmentMatch
    ? homeAdjScore !== awayAdjScore &&
      !players.some((player) => !player) &&
      !(Number.isNaN(homeAdjScore) && Number.isNaN(awayAdjScore))
      ? homeAdjScore < awayAdjScore
        ? "⬅️"
        : "➡️"
      : "="
    : "N/A";
}

export default parseMatchData;
