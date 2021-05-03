import React, {useEffect, useState} from "react";
import getTeams from "../data/getTeams";
import {Table} from "antd";
import {Link} from "react-router-dom";
import getHandicap from "../utils/getHandicap";
import listenDeleteTeam from "../data/listenDeleteTeam";
import listenCreateTeam from "../data/listenCreateTeam";
import getScores from "../data/getScores";

function DisplayDirectory() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function syncState() {
      const [teams] = await Promise.all([getTeams(), getScores()]);
      setTeams(teams);
    }
    syncState();
    const deleteTeamListener = listenDeleteTeam().subscribe({
      next: syncState,
    });

    const createTeamListener = listenCreateTeam().subscribe({
      next: syncState,
    });
    return () => {
      createTeamListener.unsubscribe();
      deleteTeamListener.unsubscribe();
    };
  }, []);
  const columns = [
    {
      title: "Player Name",
      dataIndex: "playerName",
      key: "playerName",
      render: (playerName, record) => {
        return <Link to={`/app/players/${record.playerId}`}>{playerName}</Link>;
      },
    },
    {
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
      render: (teamName, record) => {
        return <Link to={`/app/matches/${record.teamId}`}>{teamName}</Link>;
      },
    },
    {
      title: "Handicap",
      dataIndex: "handicap",
      key: "handicap",
    },
  ];

  if (teams.length === 0) {
    return <div>Loading... (no teams found)</div>;
  }

  const data = teams
    .map((team) => {
      return team.players.items.map((player) => {
        return {
          teamName: team.name,
          playerName: player.name,
          handicap: getHandicap(player),
          key: player.id,
          playerId: player.id,
          teamId: team.id,
        };
      });
    })
    .reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);

  return (
    <Table
      style={{padding: "1vw"}}
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}

export default DisplayDirectory;
