import getLowHandicap from "./getLowHandicap";

const getHighHandicap = (players, date) => {
  const lowHandicapPlayer = getLowHandicap(players, date);
  return players.find((player) => player.id !== lowHandicapPlayer.id);
};

export default getHighHandicap;
