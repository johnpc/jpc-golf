import {API, graphqlOperation} from "aws-amplify";
import {createTeam as createTeamQuery} from "../graphql/mutations";

const createTeam = async (name) => {
  const teamResponse = await API.graphql(
    graphqlOperation(createTeamQuery, {
      input: {
        name,
      },
    })
  );

  return teamResponse.data.createTeam;
};

export default createTeam;
