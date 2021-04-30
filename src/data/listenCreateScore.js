import {API, graphqlOperation} from "aws-amplify";
import {onCreateScore} from "../graphql/subscriptions";

const listenCreateScore = () => {
  return API.graphql(graphqlOperation(onCreateScore));
};

export default listenCreateScore;
