import React, {useState, useEffect} from "react";
import getTeams from "../../data/getTeams";
import getLowHandicap from "../../utils/getLowHandicap";
import getHighHandicap from "../../utils/getHighHandicap";
import {Table, Button} from "antd";
import {Link} from "react-router-dom";
import deleteTeam from "../../data/deleteTeam";
import listenDeleteTeam from "../../data/listenDeleteTeam";
import listenCreateTeam from "../../data/listenCreateTeam";

function ManageTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function syncState() {
      const teams = await getTeams();
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
  });

  const columns = [
    {
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
      render: (teamName, record) => {
        return <Link to={`/app/matches/${record.teamId}`}>{teamName}</Link>;
      },
    },
    {
      title: "Player",
      dataIndex: "player1",
      key: "player1",
      render: (playerName, record) => {
        return (
          <Link to={`/app/players/${record.player1Id}`}>{playerName}</Link>
        );
      },
    },
    {
      title: "Player",
      dataIndex: "player2",
      key: "player2",
      render: (playerName, record) => {
        return (
          <Link to={`/app/players/${record.player2Id}`}>{playerName}</Link>
        );
      },
    },
    {
      title: "Remove",
      dataIndex: "teamId",
      key: "teamId",
      render: (teamId) => {
        return (
          <Button danger onClick={() => deleteTeam(teamId)}>
            Remove
          </Button>
        );
      },
    },
  ];
  const data = teams.map((team) => {
    return {
      teamName: team.name,
      player1: getLowHandicap(team.players.items).name,
      player1Id: getLowHandicap(team.players.items).id,
      player2: getHighHandicap(team.players.items).name,
      player2Id: getHighHandicap(team.players.items).id,
      teamId: team.id,
      key: team.id,
    };
  });
  return (
    <>
      <h1>Manage Teams</h1>
      <Table columns={columns} dataSource={data} pagination={false} />
    </>
  );
}

export default ManageTeams;
