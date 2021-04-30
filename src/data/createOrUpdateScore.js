import {API, graphqlOperation} from "aws-amplify";
import {createScore, updateScore} from "../graphql/mutations";
import getScores from "../data/getScores";

const createOrUpdateScore = async (matchId, playerId, score) => {
  const scores = await getScores();
  const existingScore = scores.find((score) => {
    return (
      score.match.id === matchId && score.player.id === playerId
    );
  });

  if (existingScore) {
    await API.graphql(
      graphqlOperation(updateScore, {
        input: {
          id: existingScore.id,
          score: score,
          scoreMatchId: matchId,
          scorePlayerId: playerId,
        },
      })
    );
  } else {
    await API.graphql(
      graphqlOperation(createScore, {
        input: {
          score: score,
          scoreMatchId: matchId,
          scorePlayerId: playerId,
        },
      })
    );
  }
};

export default createOrUpdateScore;
