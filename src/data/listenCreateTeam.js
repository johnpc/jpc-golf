import {API, graphqlOperation} from "aws-amplify";
import {onCreateTeam} from "../graphql/subscriptions";

const listenCreateTeam = () => {
  return API.graphql(graphqlOperation(onCreateTeam));
};

export default listenCreateTeam;
