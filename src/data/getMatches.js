import {API, graphqlOperation} from "aws-amplify";
import {listMatchs as listMatchsQuery} from "../graphql/queries";

const getMatches = async () => {
  const result = await API.graphql(graphqlOperation(listMatchsQuery));
  return result.data.listMatchs.items.sort((match, match2) => {
    return Date.parse(match.date) > Date.parse(match2.date);
  });
};

export default getMatches;
