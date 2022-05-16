import {API, graphqlOperation} from "aws-amplify";
import {
  deleteMatch,
} from "../graphql/mutations";
import getMatches from "./getMatches";

const deleteMatches = async () => {
  const matches = await getMatches();
  const promises = matches.map(async match => {
    console.log('deleting match id: ', match.id)
        await API.graphql(
          graphqlOperation(deleteMatch, {id: match.id})
        );
  });
  return Promise.all(promises);
};

export default deleteMatches;
