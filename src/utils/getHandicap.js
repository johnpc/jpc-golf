const HANDICAP_ADJUSTMENT_FACTOR = 1;
const getHandicap = (player, thruDate) => {
  const scores = player.scores?.items.filter((score) => {
    if (!thruDate) {
      return true;
    }
    return Date.parse(score.match.date) < Date.parse(thruDate);
  });

  if (scores < 2 || !scores) {
    return 0;
  }

  const handicap =
    scores.reduce((total, score) => total + score.score, 0) / scores.length;
  return parseFloat((handicap * HANDICAP_ADJUSTMENT_FACTOR).toFixed(2));
};

export default getHandicap;
