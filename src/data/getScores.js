import {API, graphqlOperation} from "aws-amplify";
import {listScores as listScoresQuery} from "../graphql/queries";

const getScores = async () => {
  const result = await API.graphql(graphqlOperation(listScoresQuery));
  return result.data.listScores.items;
};

export default getScores;
