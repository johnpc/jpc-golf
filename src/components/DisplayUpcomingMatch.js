import React, {useEffect, useState} from "react";
import {Table, Alert, Select, Empty} from "antd";
import getMatches from "../data/getMatches";
import getPlayers from "../data/getPlayers";
import parseMatchData from "../utils/parseMatchData";
import {Link} from "react-router-dom";
import listenCreateScore from "../data/listenCreateScore";
import listenUpdateScore from "../data/listenUpdateScore";
const {Option} = Select;

function DisplayUpcomingMatch() {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({});

  useEffect(() => {
    async function setupState() {
      const [matches, players] = await Promise.all([
        getMatches(),
        getPlayers(),
      ]);
      setMatches(matches);
      setPlayers(players);
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
    return <div>Loading... (no players found)</div>;
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
            <Link to={`/app/players/${record.homePlayerId}`}>{playerName}</Link>
          );
        }
        return playerName;
      },
    },
    {
      title: "Handicap",
      dataIndex: "homeHandicap",
      key: "homeHandicap",
    },
    {
      title: "Raw Score",
      dataIndex: "homeRaw",
      key: "homeRaw",
    },
    {
      title: "Adj Score",
      dataIndex: "homeAdj",
      key: "homeAdj",
    },
    {
      title: "| VS |",
      dataIndex: "vs",
      key: "vs",
    },
    {
      title: "Name",
      dataIndex: "awayName",
      key: "awayName",
      render: (playerName, record) => {
        if (record.awayPlayerId) {
          return (
            <Link to={`/app/players/${record.awayPlayerId}`}>{playerName}</Link>
          );
        }
        return playerName;
      },
    },
    {
      title: "Handicap",
      dataIndex: "awayHandicap",
      key: "awayHandicap",
    },
    {
      title: "Raw Score",
      dataIndex: "awayRaw",
      key: "awayRaw",
    },
    {
      title: "Adj Score",
      dataIndex: "awayAdj",
      key: "awayAdj",
    },
  ];

  const matchJsx = matches
    .filter((match) => {
      if (player.id) {
        return (
          match.homeTeam.players.items.any(
            (matchPlayer) => player.id === matchPlayer.id
          ) ||
          match.awayTeam.players.items.any((matchPlayer) => player.id === matchPlayer.id)
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

      return (
        <div key={match.id}>
          <h1>
            {match.homeTeam.name} vs {match.awayTeam.name}:{" "}
            {new Date(match.date).toDateString()}
          </h1>
          <Alert
            message={
              homePoints > awayPoints
                ? `${match.homeTeam.name} is awarded ${homePoints} points`
                : `${match.awayTeam.name} is awarded ${awayPoints} points`
            }
            type="success"
          />
          <Alert
            message={
              homePoints < awayPoints
                ? `${match.homeTeam.name} is awarded ${homePoints} points`
                : `${match.awayTeam.name} is awarded ${awayPoints} points`
            }
            type="info"
          />
          <Table columns={columns} dataSource={data} pagination={false} />
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
