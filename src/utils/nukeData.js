import deleteTeam from "../data/deleteTeam";
import getTeams from "../data/getTeams";

async function nukeData() {
  console.warn("Initiating nuclear detonation. This is not a test.");
  const teams = await getTeams();
  const promises = teams.map((team) => deleteTeam(team.id));
  await Promise.all(promises);
  console.log(`Deleted ${promises.length} teams`);
}

export default nukeData;
