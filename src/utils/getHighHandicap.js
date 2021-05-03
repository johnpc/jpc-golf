import getLowHandicap from "./getLowHandicap";

const getHighHandicap = (players, date) => {
  if (!players || players.length === 0) {
    return false;
  }
  const lowHandicapPlayer = getLowHandicap(players, date);
  return players.find((player) => player.id !== lowHandicapPlayer.id);
};

export default getHighHandicap;
