import {API, graphqlOperation} from "aws-amplify";
import {listTeams as listTeamsQuery} from "../graphql/queries";

const getTeams = async () => {
  const result = await API.graphql(graphqlOperation(listTeamsQuery));
  return result.data.listTeams.items;
};

export default getTeams;