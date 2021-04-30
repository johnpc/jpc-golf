import {API, graphqlOperation} from "aws-amplify";
import {onUpdateScore} from "../graphql/subscriptions";

const listenUpdateScore = () => {
  return API.graphql(graphqlOperation(onUpdateScore));
};

export default listenUpdateScore;
