import getHandicap from "./getHandicap";

const getLowHandicap = (players, date) => {
  date = date ? new Date(Date.parse(date)) : new Date();
  return players.reduce((lowHandicapPlayer, player) => {
    if (!lowHandicapPlayer) {
      return player;
    }
    return getHandicap(player, date) < getHandicap(lowHandicapPlayer, date)
      ? player
      : lowHandicapPlayer;
  }, false);
};

export default getLowHandicap;
