import {API, graphqlOperation} from "aws-amplify";
import {listPlayers as listPlayersQuery} from "../graphql/queries";

const getPlayers = async () => {
  const players = await API.graphql(graphqlOperation(listPlayersQuery));
  return players.data.listPlayers.items;
};

export default getPlayers;