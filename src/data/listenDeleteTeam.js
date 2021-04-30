import {API, graphqlOperation} from "aws-amplify";
import {onDeleteTeam} from "../graphql/subscriptions";

const listenDeleteTeam = () => {
  return API.graphql(graphqlOperation(onDeleteTeam));
};

export default listenDeleteTeam;
