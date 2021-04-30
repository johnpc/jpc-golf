import {API, graphqlOperation} from "aws-amplify";
import {createPlayer as createPlayerQuery} from "../graphql/mutations";

const createPlayer = async (name, team, email, phone) => {
  const playerResponse = await API.graphql(
    graphqlOperation(createPlayerQuery, {
      input: {
        name,
        userId: `${name}-${team.name}`,
        email,
        phone,
        playerTeamId: team.id,
      },
    })
  );

  return playerResponse.data.createPlayer;
};

export default createPlayer;
