import {API, graphqlOperation} from "aws-amplify";
import getTeams from "../data/getTeams";
import {createMatch} from "../graphql/mutations";
import Permutation from "iterative-permutation";

export const FIRST_MATCH_DATE = "2021-06-10T21:47:30.499Z";
export const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const MS_PER_WEEK = MS_PER_DAY * 7;
const WEEKS_OF_PLAY = 8;

async function setMatchSchedule() {
  let matchTeams = await getTeams();
  let matchGenerator = new Permutation(matchTeams);

  let matchesCreated = 0;
  const promises = Array.from(Array(WEEKS_OF_PLAY)).map(
    async (_, weekNumber) => {
      const matchDate = Date.parse(FIRST_MATCH_DATE) + MS_PER_WEEK * weekNumber;
      console.log(`Creating matches on date: ${new Date(matchDate)}`);
      const matchUps = [];
      if (!matchGenerator.hasNext()) {
        matchGenerator = new Permutation(matchTeams);
      }
      const combination = matchGenerator.next()
      // burn one
      matchGenerator.next();

      if (combination.length % 2) {
        // if there are an odd number of teams, someone has to skip their match :(
        combination.pop();
      }
      function chunkArrayInGroups(arr, size) {
        const myArray = [];
        for (let i = 0; i < arr.length; i += size) {
          myArray.push(arr.slice(i, i + size));
        }
        return myArray;
      }

      const groups = chunkArrayInGroups(combination, 2);
      groups.forEach((group) => {
        const [homeTeam, awayTeam] = group;
        matchUps.push({homeTeam, awayTeam});
      });
      const promises = matchUps.map(async (matchUp) => {
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
