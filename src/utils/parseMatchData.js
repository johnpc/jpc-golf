import getHandicap from "./getHandicap";
import getHighHandicap from "./getHighHandicap";
import getLowHandicap from "./getLowHandicap";

const parseMatchData = (match) => {
  const homeLowHandicapPlayer = getLowHandicap(match.homeTeam.players.items);
  const homeHighHandicapPlayer = getHighHandicap(match.homeTeam.players.items);
  const awayLowHandicapPlayer = getLowHandicap(match.awayTeam.players.items);
  const awayHighHandicapPlayer = getHighHandicap(match.awayTeam.players.items);

  const homeLowHandicap = getHandicap(homeLowHandicapPlayer, match.date);
  const awayLowHandicap = getHandicap(awayLowHandicapPlayer, match.date);
  const homeHighHandicap = getHandicap(homeHighHandicapPlayer, match.date);
  const awayHighHandicap = getHandicap(awayHighHandicapPlayer, match.date);

  const homeLowRawScore = match.scores.items.find(
    (score) => score.player.id === homeLowHandicapPlayer.id
  ).score;

  const homeHighRawScore = match.scores.items.find(
    (score) => score.player.id === homeHighHandicapPlayer.id
  ).score;

  const awayLowRawScore = match.scores.items.find(
    (score) => score.player.id === awayLowHandicapPlayer.id
  ).score;

  const awayHighRawScore = match.scores.items.find(
    (score) => score.player.id === awayHighHandicapPlayer.id
  ).score;

  const homeLowAdjScore = homeLowRawScore + homeLowHandicap;
  const homeHighAdjScore = homeHighRawScore + homeHighHandicap;
  const awayLowAdjScore = awayLowRawScore + awayLowHandicap;
  const awayHighAdjScore = awayHighRawScore + awayHighHandicap;

  const data = [
    {
      homePlayerId: homeLowHandicapPlayer.id,
      homeName: homeLowHandicapPlayer.name,
      homeHandicap: homeLowHandicap,
      homeRaw: homeLowRawScore,
      homeAdj: homeLowAdjScore,
      vs:
        homeLowAdjScore !== awayLowAdjScore
          ? homeLowAdjScore < awayLowAdjScore
            ? "⬅️"
            : "➡️"
          : "=",
      awayPlayerId: awayLowHandicapPlayer.id,
      awayName: awayLowHandicapPlayer.name,
      awayHandicap: awayLowHandicap,
      awayRaw: awayLowRawScore,
      awayAdj: awayLowAdjScore,
      key: `${match.id}LowHandicap`,
    },
    {
      homePlayerId: homeHighHandicapPlayer.id,
      homeName: homeHighHandicapPlayer.name,
      homeHandicap: homeHighHandicap,
      homeRaw: homeHighRawScore,
      homeAdj: homeHighAdjScore,
      vs:
        homeHighAdjScore !== awayHighAdjScore
          ? homeHighAdjScore < awayHighAdjScore
            ? "⬅️"
            : "➡️"
          : "=",
      awayPlayerId: awayHighHandicapPlayer.id,
      awayName: awayHighHandicapPlayer.name,
      awayHandicap: awayHighHandicap,
      awayRaw: awayHighRawScore,
      awayAdj: awayHighAdjScore,
      key: `${match.id}HighHandicap`,
    },
    {
      homeName: match.homeTeam.name,
      homeHandicap: homeLowHandicap + homeHighHandicap,
      homeRaw: homeLowRawScore + homeHighRawScore,
      homeAdj: homeLowAdjScore + homeHighAdjScore,
      vs:
        homeLowAdjScore + homeHighAdjScore !==
        awayLowAdjScore + awayHighAdjScore
          ? homeLowAdjScore + homeHighAdjScore <
            awayLowAdjScore + awayHighAdjScore
            ? "⬅️"
            : "➡️"
          : "=",
      awayName: match.awayTeam.name,
      awayHandicap: awayLowHandicap + awayHighHandicap,
      awayRaw: awayLowRawScore + awayHighRawScore,
      awayAdj: awayLowAdjScore + awayHighAdjScore,
      key: `${match.id}Team`,
    },
  ];
  return data;
};

export default parseMatchData;
