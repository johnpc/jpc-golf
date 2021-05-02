import {API, graphqlOperation} from "aws-amplify";
import {
  deletePlayer,
  deleteScore,
  deleteTeam as deleteTeamQuery,
  deleteMatch,
  updateMatch,
} from "../graphql/mutations";

const deleteTeam = async (id) => {
  const teamResponse = await API.graphql(
    graphqlOperation(deleteTeamQuery, {
      input: {
        id,
      },
    })
  );

  const deletedTeam = teamResponse.data.deleteTeam;
  deletedTeam.players.items.map(async (player) => {
    const playerResponse = await API.graphql(
      graphqlOperation(deletePlayer, {
        input: {
          id: player.id,
        },
      })
    );
    const deletedPlayer = playerResponse.data.deletePlayer;
    deletedPlayer.scores.items.map(async (score) => {
      const scoreResponse = await API.graphql(
        graphqlOperation(deleteScore, {
          input: {
            id: score.id,
          },
        })
      );
      const deletedScore = scoreResponse.data.deleteScore;
      const matchTeams = [
        deletedScore.match.awayTeam,
        deletedScore.match.homeTeam,
      ];
      if (matchTeams.includes(null) && matchTeams.includes(deletedTeam.id)) {
        await API.graphql(
          graphqlOperation(deleteMatch, {id: deletedScore.match.id})
        );
      } else {
        await API.graphql(
          graphqlOperation(updateMatch, {
            input: {
              id: deletedScore.match.id,
              date: deletedScore.match.date,
              matchAwayTeamId:
                deletedTeam.id === deletedScore.match.awayTeam?.id
                  ? null
                  : deletedScore.match.awayTeam?.id,
              matchHomeTeamId:
                deletedTeam.id === deletedScore.match.homeTeam?.id
                  ? null
                  : deletedScore.match.homeTeam?.id,
            },
          })
        );
      }
    });
  });
};

export default deleteTeam;
