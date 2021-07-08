import React, {useEffect, useState} from "react";
import {Table, Alert, Select, Empty, Spin, Tooltip} from "antd";
import getMatches from "../data/getMatches";
import getPlayers from "../data/getPlayers";
import parseMatchData from "../utils/parseMatchData";
import {Link} from "react-router-dom";
import listenCreateScore from "../data/listenCreateScore";
import listenUpdateScore from "../data/listenUpdateScore";
import getCryptoValue from "../utils/getCryptoValue";
const {Option} = Select;

function DisplayUpcomingMatch() {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({});
  const [prices, setPrices] = useState({});

  useEffect(() => {
    async function setupState() {
      const [matches, players] = await Promise.all([
        getMatches(),
        getPlayers(),
      ]);
      setMatches(matches);
      setPlayers(players);

      async function setupPrices() {
        let tempPrices = {};
        const promises = matches.map(async (match) => {
          const p = ["BTC", "ETH", "DOGE", "ADA"].map(async (crypto) => {
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
          return await Promise.all(p);
        });

        await Promise.all(promises);
        console.log(tempPrices);
        setPrices(tempPrices);
      }
      if (!Object.keys(prices).length) {
        await setupPrices();
      }
    }
    setupState();
    const createScoreListener = listenCreateScore().subscribe({
      next: setupState,
    });

    const updateScoreListener = listenUpdateScore().subscribe({
      next: setupState,
    });
    return () => {
      updateScoreListener.unsubscribe();
      createScoreListener.unsubscribe();
    };
  }, []);

  if (players.length === 0) {
    return <Spin />;
  }
  const playerSelectDropdown = (
    <Select
      showSearch
      style={{width: "80vw", padding: "1vw 0"}}
      placeholder="Select a player"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={(value) => {
        const player = players.find((player) => player.id === value);
        setPlayer(player);
      }}
    >
      {players.map((player) => {
        return (
          <Option key={player.id} value={player.id}>
            {player.name} - {player.team.name}
          </Option>
        );
      })}
    </Select>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "homeName",
      key: "homeName",
      render: (playerName, record) => {
        if (record.homePlayerId) {
          return (
            <>
              <Link to={`/app/players/${record.homePlayerId}`}>
                {playerName}
              </Link>
              <br />
              <small>{`(${record.homeHandicap} hdc)`}</small>
            </>
          );
        } else if (record.homeTeamId) {
          const cryptoMatch = ["BTC", "ETH", "DOGE", "ADA"].find((crypto) =>
            playerName.includes(crypto)
          );
          const price =
            cryptoMatch && prices[record.matchDate]
              ? prices[record.matchDate][cryptoMatch]
              : false;
          if (cryptoMatch && price) {
            return (
              <Tooltip
                title={`${cryptoMatch} was ${price} on ${new Date(
                  record.matchDate
                ).toDateString()}.`}
              >
                <Link to={`/app/matches/${record.homeTeamId}`}>
                  <b>{playerName}</b>
                </Link>
              </Tooltip>
            );
          } else {
            return (
              <Link to={`/app/matches/${record.homeTeamId}`}>
                <b>{playerName}</b>
              </Link>
            );
          }
        }
        return playerName;
      },
    },
    {
      title: "VS",
      dataIndex: "vs",
      key: "vs",
      className: "ant-tooltip-inner",
      responsive: ["md"],
    },
    {
      title: "Name",
      dataIndex: "awayName",
      key: "awayName",
      render: (playerName, record) => {
        if (record.awayPlayerId) {
          return (
            <>
              <Link to={`/app/players/${record.awayPlayerId}`}>
                {playerName}
              </Link>
              <br />
              <small>{`(${record.awayHandicap} hdc)`}</small>
            </>
          );
        } else if (record.awayTeamId) {
          const cryptoMatch = ["BTC", "ETH", "DOGE", "ADA"].find((crypto) =>
            playerName.includes(crypto)
          );
          const price =
            cryptoMatch && prices[record.matchDate]
              ? prices[record.matchDate][cryptoMatch]
              : false;
          if (cryptoMatch && price) {
            return (
              <Tooltip
                title={`${cryptoMatch} was ${price} on ${new Date(
                  record.matchDate
                ).toDateString()}.`}
              >
                <Link to={`/app/matches/${record.awayTeamId}`}>
                  <b>{playerName}</b>
                </Link>
              </Tooltip>
            );
          }
        }
        return playerName;
      },
    },
  ];

  const matchJsx = matches
    .filter((match) => {
      if (player.id) {
        return (
          match.homeTeam.players.items.some(
            (matchPlayer) => player.id === matchPlayer.id
          ) ||
          match.awayTeam.players.items.some(
            (matchPlayer) => player.id === matchPlayer.id
          )
        );
      }
      return true;
    })
    .filter((match) => {
      return (
        Date.parse(match.date) > new Date().getTime() &&
        Date.parse(match.date) < new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      );
    })
    .map((match) => {
      const data = parseMatchData(match);
      const homePoints = data.filter((datum) => datum.vs === "⬅️").length;
      const awayPoints = data.filter((datum) => datum.vs === "➡️").length;
      const pointsAwardedJsx =
        [match.homeTeam, match.awayTeam].some((team) => !team) ||
        Date.parse(match.date) > Date.now() ? (
          ""
        ) : (
          <>
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
            />
          </>
        );
      return (
        <div key={match.id}>
          <h1>
            {match.homeTeam.name} vs {match.awayTeam.name}:{" "}
            {new Date(match.date).toDateString()}
          </h1>
          {pointsAwardedJsx}
          <Table columns={columns} dataSource={data} pagination={false} />
          <hr />
        </div>
      );
    });
  if (matchJsx.length === 0) {
    return (
      <div style={{padding: "1vw"}}>
        <Alert
          type="warning"
          message={
            player.name
              ? `No match scheduled for this week for ${player.name}.`
              : "Please select a player to view their upcoming match."
          }
        />
        {playerSelectDropdown}
        <Empty />
      </div>
    );
  }

  return (
    <div style={{padding: "1vw"}}>
      {playerSelectDropdown}
      {matchJsx}
    </div>
  );
}

export default DisplayUpcomingMatch;
