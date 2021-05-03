import createOrUpdateScore from "../data/createOrUpdateScore";
import createPlayer from "../data/createPlayer";
import createTeam from "../data/createTeam";
import getMatches from "../data/getMatches";
import setMatchSchedule from "./setMatchSchedule";

async function seedData() {
  console.log("You demo data is coming right up.");
  const fakeTeams = [
    {
      teamName: "Bitcoiners",
      player1: "Satoshi",
      player2: "Nakamoto",
    },
    {
      teamName: "Mack Daddies",
      player1: 'Tim "The Toolman" Tayler',
      player2: "Father John Misty",
    },
    {
      teamName: "The Warthogs",
      player1: "Cleetus",
      player2: "Mr. Clean",
    },
    {
      teamName: "2 Sexy Studs",
      player1: "Harold",
      player2: "Kumar",
    },
  ];

  const promises = fakeTeams.map(async (fakeTeam) => {
    console.log(`Creating fake team: ${fakeTeam.teamName}`);
    const team = await createTeam(fakeTeam.teamName);
    await createPlayer(fakeTeam.player1, team, "fake@email.com", "8675309");
    await createPlayer(fakeTeam.player2, team, "fake@email.com", "8675309");
    console.log(`Done creating fake team: ${fakeTeam.teamName}`);
  });

  await Promise.all(promises);
  await setMatchSchedule();

  const matches = await getMatches();
  console.log('TOO', matches)
  await Promise.all(
    matches.map(async (match) => {
      return await Promise.all(
        [match.homeTeam, match.awayTeam].map(async (team) => {
          console.log('JCJC', team);
          return await Promise.all(
            team.players.items.map(async (player) => {
              await createOrUpdateScore(
                match.id,
                player.id,
                Math.floor(Math.random() * 63) - 27
              );
            })
          );
        })
      );
    })
  );

  console.log(
    `Created ${promises.length} seed data teams. Enjoy experimenting!`
  );
}

export default seedData;
