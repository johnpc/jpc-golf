import {API, graphqlOperation} from "aws-amplify";
import getTeams from "../data/getTeams";
import {createMatch} from "../graphql/mutations";
export const FIRST_MATCH_DATE = "2021-05-07T21:47:30.499Z";
export const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
const WEEKS_OF_PLAY = 8;

async function setMatchSchedule() {
  let matchTeams = await getTeams();
  let matchesCreated = 0;
  const promises = Array.from(Array(WEEKS_OF_PLAY)).map(
    async (_, weekNumber) => {
      const matchDate = Date.parse(FIRST_MATCH_DATE) + MS_PER_WEEK * weekNumber;
      if (matchTeams.length % 2 !== 0) {
        // Choose odd man out for the week
        let oddManOutIndex = weekNumber;
        while (oddManOutIndex >= matchTeams.length) {
          oddManOutIndex = oddManOutIndex - matchTeams.length;
        }
        const oddManOut = matchTeams[oddManOutIndex];

        // Create a weird match for the odd man out with no opponent
        const oddManOutMatch = await API.graphql(
          graphqlOperation(createMatch, {
            input: {
              date: new Date(matchDate).toISOString(),
              matchHomeTeamId: oddManOut.id,
            },
          })
        );
        matchesCreated++;

        console.log(
          `Team ${oddManOut.name} is the odd man out for week ${weekNumber}`,
          oddManOutMatch
        );

        // remove the odd man out from the list of teams
        matchTeams = matchTeams.filter((team) => team.id !== oddManOut.id);
      }

      const homeTeams = matchTeams.filter((_, i) => i % 2 === 0);
      const awayTeams = matchTeams.filter((_, i) => i % 2 !== 0);
      const matchMapping = homeTeams.map((homeTeam, matchupIndex) => {
        let awayTeamIndex = matchupIndex + weekNumber;
        while (awayTeamIndex >= awayTeams.length) {
          awayTeamIndex = awayTeamIndex - awayTeams.length;
        }
        const awayTeam = awayTeams[awayTeamIndex];
        return {homeTeam, awayTeam};
      });

      const promises = matchMapping.map(async (matchUp) => {
        console.log(
          `Creating match: ${matchUp.homeTeam.name} vs ${matchUp.awayTeam.name}`
        );
        return await API.graphql(
          graphqlOperation(createMatch, {
            input: {
              date: new Date(matchDate).toISOString(),
              matchHomeTeamId: matchUp.homeTeam.id,
              matchAwayTeamId: matchUp.awayTeam.id,
            },
          })
        );
      });

      const createdMatches = await Promise.all(promises);
      matchesCreated += createdMatches.length;
    }
  );
  await Promise.all(promises);
  console.log(`${matchesCreated} matches created.`);
}

export default setMatchSchedule;
