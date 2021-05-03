import getHandicap from "./getHandicap";
import getHighHandicap from "./getHighHandicap";
import getLowHandicap from "./getLowHandicap";
const FIRST_MATCH_DATE = "2021-05-07T21:47:30.499Z";
const HANDICAP_ESTABLISHMENT_WEEKS = 2;

const parseMatchData = (match) => {
  const isHandicapEstablishmentMatch =
    Date.parse(match.date) <
    Date.parse(FIRST_MATCH_DATE) +
      1000 * 60 * 60 * 24 * 7 * HANDICAP_ESTABLISHMENT_WEEKS;
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
      homeRaw: homeLowRawScore + homeHighRawScore,
      homeAdj: homeLowAdjScore + homeHighAdjScore,
      vs: isHandicapEstablishmentMatch
        ? homeLowAdjScore + homeHighAdjScore !==
            awayLowAdjScore + awayHighAdjScore &&
          ![
            homeHighHandicapPlayer,
            homeLowHandicapPlayer,
            awayHighHandicapPlayer,
            awayLowHandicapPlayer,
          ].some((player) => !player)
          ? homeLowAdjScore + homeHighAdjScore <
            awayLowAdjScore + awayHighAdjScore
            ? "⬅️"
            : "➡️"
          : "="
        : "N/A",
      awayName: match.awayTeam?.name,
      awayHandicap: awayLowHandicap + awayHighHandicap,
      awayRaw: awayLowRawScore + awayHighRawScore,
      awayAdj: awayLowAdjScore + awayHighAdjScore,
      key: `${match.id}Team`,
    },
    {
      homePlayerId: homeLowHandicapPlayer?.id,
      homeName: homeLowHandicapPlayer?.name,
      homeHandicap: homeLowHandicap,
      homeRaw: homeLowRawScore,
      homeAdj: homeLowAdjScore,
      vs: isHandicapEstablishmentMatch
        ? homeLowAdjScore !== awayLowAdjScore &&
          ![homeLowHandicapPlayer, awayLowHandicapPlayer].some(
            (player) => !player
          )
          ? homeLowAdjScore < awayLowAdjScore
            ? "⬅️"
            : "➡️"
          : "="
        : "N/A",
      awayPlayerId: awayLowHandicapPlayer?.id,
      awayName: awayLowHandicapPlayer?.name,
      awayHandicap: awayLowHandicap,
      awayRaw: awayLowRawScore,
      awayAdj: awayLowAdjScore,
      key: `${match.id}LowHandicap`,
    },
    {
      homePlayerId: homeHighHandicapPlayer?.id,
      homeName: homeHighHandicapPlayer?.name,
      homeHandicap: homeHighHandicap,
      homeRaw: homeHighRawScore,
      homeAdj: homeHighAdjScore,
      vs: isHandicapEstablishmentMatch
        ? homeHighAdjScore !== awayHighAdjScore &&
          ![homeHighHandicapPlayer, awayHighHandicapPlayer].some(
            (player) => !player
          )
          ? homeHighAdjScore < awayHighAdjScore
            ? "⬅️"
            : "➡️"
          : "="
        : "N/A",
      awayPlayerId: awayHighHandicapPlayer?.id,
      awayName: awayHighHandicapPlayer?.name,
      awayHandicap: awayHighHandicap,
      awayRaw: awayHighRawScore,
      awayAdj: awayHighAdjScore,
      key: `${match.id}HighHandicap`,
    },
  ];
  return data;
};

export default parseMatchData;
