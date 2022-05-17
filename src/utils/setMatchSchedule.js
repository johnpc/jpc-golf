import {API, graphqlOperation} from "aws-amplify";
import getTeams from "../data/getTeams";
import {createMatch} from "../graphql/mutations";
import * as robin from 'roundrobin';

export const FIRST_MATCH_DATE = "2022-05-19T21:47:30.499Z";
export const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const MS_PER_WEEK = MS_PER_DAY * 7;
const WEEKS_OF_PLAY = 8;

async function setMatchSchedule() {
  console.log('Setting match schedule');
  let matchTeams = await getTeams();

  let matchIds = robin(matchTeams.length);
  while (matchIds.length < WEEKS_OF_PLAY) {
    matchIds = matchIds.concat(matchIds);
  }
  matchIds = matchIds.slice(0, WEEKS_OF_PLAY);
  console.log(matchIds, matchTeams);
  const promises = matchIds.map(async (matchUp, weekNumber) => {
    const p = matchUp.map(async m => {
      const matchDate = Date.parse(FIRST_MATCH_DATE) + MS_PER_WEEK * weekNumber;
      console.log(`Creating matches on date: ${new Date(matchDate)}`);

      const homeTeam = matchTeams[m[0] - 1];
      const awayTeam = matchTeams[m[1] - 1];
      console.log(
        `Creating match: ${homeTeam.name} vs ${awayTeam.name}`
      );
      return await API.graphql(
        graphqlOperation(createMatch, {
          input: {
            date: new Date(matchDate).toISOString(),
            matchHomeTeamId: homeTeam.id,
            matchAwayTeamId: awayTeam.id,
          },
        })
      );
    });
    return await Promise.all(p);
  });
  await Promise.all(promises);
}

export default setMatchSchedule;
