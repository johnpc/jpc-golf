import {API, graphqlOperation} from "aws-amplify";
import {getPlayer as getPlayerQuery} from "../graphql/queries";

const getPlayer = async (id) => {
  const result = await API.graphql(
    graphqlOperation(getPlayerQuery, {
      id,
    })
  );
  return result.data.getPlayer;
};

export default getPlayer;
