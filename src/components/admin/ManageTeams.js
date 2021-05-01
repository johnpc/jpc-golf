import React, {Component} from "react";
import getMatches from "../../data/getMatches";
import getTeams from "../../data/getTeams";
import getScores from "../../data/getScores";
import getPlayers from "../../data/getPlayers";
import getLowHandicap from "../../utils/getLowHandicap";
import getHighHandicap from "../../utils/getHighHandicap";
import {Table, Button} from "antd";
import {Link} from "react-router-dom";
import deleteTeam from "../../data/deleteTeam";
import listenDeleteTeam from "../../data/listenDeleteTeam";
import listenCreateTeam from "../../data/listenCreateTeam";

class ManageTeams extends Component {
  state = {
    teams: [],
    matches: [],
    scores: [],
    players: [],
  };

  syncState = async () => {
    const [matches, players, scores, teams] = await Promise.all([
      getMatches(),
      getPlayers(),
      getScores(),
      getTeams(),
    ]);
    this.setState({
      matches,
      players,
      scores,
      teams,
    });
  }

  componentDidMount = async () => {
    this.syncState();
    this.deleteTeamListener = listenDeleteTeam().subscribe({
      next: this.syncState,
    });

    this.createTeamListener = listenCreateTeam().subscribe({
      next: this.syncState,
    });
  };

  componentWillUnmount() {
    this.createTeamListener.unsubscribe();
    this.deleteTeamListener.unsubscribe();
  }

  render() {
    const {teams} = this.state;
    const columns = [
      {
        title: "Team Name",
        dataIndex: "teamName",
        key: "teamName",
        render: (teamName, record) => {
          return <Link to={`/matches/${record.teamId}`}>{teamName}</Link>;
        },
      },
      {
        title: "Player",
        dataIndex: "player1",
        key: "player1",
        render: (playerName, record) => {
          return <Link to={`/players/${record.player1Id}`}>{playerName}</Link>;
        },
      },
      {
        title: "Player",
        dataIndex: "player2",
        key: "player2",
        render: (playerName, record) => {
          return <Link to={`/players/${record.player2Id}`}>{playerName}</Link>;
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
}

export default ManageTeams;
