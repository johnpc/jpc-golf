const getHandicap = (player, thruDate) => {
  const scores = player.scores?.items.filter((score) => {
    return Date.parse(score.match.date) < Date.parse(thruDate);
  });

  if (scores < 2 || !scores) {
    return 0;
  }

  return (
    scores.reduce((total, score) => total + score.score, 0) / scores.length
  );
};

export default getHandicap;
