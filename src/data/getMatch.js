import {API, graphqlOperation} from "aws-amplify";
import {getMatch as getMatchQuery} from "../graphql/queries";

const getMatch = async (id) => {
  const result = await API.graphql(graphqlOperation(getMatchQuery, {
    id,
  }));
  return result.data.getMatch;
};

export default getMatch;