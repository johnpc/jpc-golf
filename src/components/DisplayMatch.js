import {Alert} from "antd";
import React, {useState, useEffect} from "react";
import {withRouter} from "react-router";
import getMatch from "../data/getMatch";
import getCryptoValue from "../utils/getCryptoValue";
import getHandicap from "../utils/getHandicap";
import parseMatchData from "../utils/parseMatchData";

function DisplayMatch(params) {
  const [matchId] = useState(params.match.params.matchId);
  const [prices, setPrices] = useState({});
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function setupState() {
      const match = await getMatch(matchId);
      setMatch(match);
      async function setupPrices() {
        let tempPrices = {};
        const promises = ["BTC", "ETH", "DOGE", "ADA"].map(async (crypto) => {
          const price = await getCryptoValue(crypto, match.date);
          if (price && price !== "N/A") {
            if (!tempPrices[match.date]) {
              const mapping = {};
              mapping[crypto] = price;
              tempPrices[match.date] = mapping;
            } else {
              tempPrices[match.date][crypto] = price;
            }
          }
        });

        await Promise.all(promises);
        setPrices(tempPrices);
      }
      if (!Object.keys(prices).length) {
        await setupPrices();
      }
    }
    setupState();
  }, []);
  if (!match) {
    return <div>loading...</div>;
  }

  const teams = [match.homeTeam, match.awayTeam];
  const matchData = parseMatchData(match);
  const homePoints = matchData.filter((datum) => datum.vs === "⬅️").length;
  const awayPoints = matchData.filter((datum) => datum.vs === "➡️").length;

  return (
    <div>
      <Alert
        message={
          homePoints >= awayPoints
            ? `${match.homeTeam?.name} is awarded ${homePoints} points`
            : `${match.awayTeam?.name} is awarded ${awayPoints} points`
        }
        type="success"
      />
      <Alert
        message={
          homePoints < awayPoints
            ? `${match.homeTeam?.name} is awarded ${homePoints} points`
            : `${match.awayTeam?.name} is awarded ${awayPoints} points`
        }
        type="info"
      />{" "}
      {teams.map((team) => {
        let teamHeaderJsx;
        const cryptoMatch = ["BTC", "ETH", "DOGE", "ADA"].find((crypto) =>
          team.name.includes(crypto)
        );
        const price =
          cryptoMatch && prices[match.date]
            ? prices[match.date][cryptoMatch]
            : false;
        if (cryptoMatch && price) {
          teamHeaderJsx = (
            <h2>
              {team.name} (price was {price})
            </h2>
          );
        } else {
          teamHeaderJsx = <h2>{team.name}</h2>;
        }

        console.log(match.date);
        const teamBodyJsx = match.scores.items
          .filter((score) =>
            team.players.items.find((player) => score.player.id === player.id)
          )
          .map((score) => {
            return (
              <div key={`${score.player.id}`}>
                <strong>{score.player.name}</strong>
                <ul>
                  <li>Handicap: {getHandicap(score.player, match.date)}</li>
                  <li>Score: {score.score}</li>
                  <li>
                    Adjusted Score:{" "}
                    {score.score - getHandicap(score.player, match.date)}
                  </li>
                </ul>
              </div>
            );
          });

        return (
          <div key={`${team.id}`}>
            {teamHeaderJsx}
            {teamBodyJsx}
          </div>
        );
      })}
    </div>
  );
}
export default withRouter(DisplayMatch);
