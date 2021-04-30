import React, {Component} from "react";
import {listTeams} from "../graphql/queries";
import {API, graphqlOperation} from "aws-amplify";
import {Table} from "antd";
import {Link} from "react-router-dom";
import getHandicap from "../utils/getHandicap";

class DisplayDirectory extends Component {
  state = {
    teams: [],
  };

  componentDidMount = async () => {
    const teams = await this.getTeams();
    this.setState({
      teams,
    });
  };

  getTeams = async () => {
    const result = await API.graphql(graphqlOperation(listTeams));
    return result.data.listTeams.items;
  };

  render() {
    const columns = [
      {
        title: "Player Name",
        dataIndex: "playerName",
        key: "playerName",
        render: (playerName, record) => {
          return <Link to={`/players]/${record.playerId}`}>{playerName}</Link>;
        },
      },
      {
        title: "Team Name",
        dataIndex: "teamName",
        key: "teamName",
        render: (teamName, record) => {
          return <Link to={`/matches/${record.teamId}`}>{teamName}</Link>;
        },
      },
      {
        title: "Handicap",
        dataIndex: "handicap",
        key: "handicap",
      },
    ];

    const {teams} = this.state;
    if (teams.length === 0) {
      return <div>Loading... (no teams found)</div>;
    }

    const data = teams.map((team) => {
      return team.players.items.map((player) => {
        return {
          teamName: team.name,
          playerName: player.name,
          handicap: getHandicap(player, new Date()),
          key: player.id,
          playerId: player.id,
          teamId: team.id,
        };
      });
    }).reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);

    return <Table columns={columns} dataSource={data} pagination={false} />;
  }
}

export default DisplayDirectory;