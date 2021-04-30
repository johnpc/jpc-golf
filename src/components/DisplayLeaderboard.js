import React, {Component} from "react";
import {listTeams} from "../graphql/queries";
import {API, graphqlOperation} from "aws-amplify";
import {Table} from "antd";
import parseMatchData from "../utils/parseMatchData";

class DisplayMatches extends Component {
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
        title: "Team Name",
        dataIndex: "teamName",
        key: "teamName",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Points",
        dataIndex: "points",
        key: "points",
      },
    ];

    const {teams} = this.state;
    if (teams.length === 0) {
      return <div>Loading... (no teams found)</div>;
    }

    const data = teams
      .map((team) => {
        const homePoints = team.homeMatches.items.reduce((acc, match) => {
          return (
            acc +
            parseMatchData(match).filter((datum) => datum.vs === "⬅️").length
          );
        }, 0);
        const awayPoints = team.awayMatches.items.reduce((acc, match) => {
          return (
            acc +
            parseMatchData(match).filter((datum) => datum.vs === "➡️").length
          );
        }, 0);
        return {
          teamName: team.name,
          points: homePoints + awayPoints,
          key: team.id,
        };
      })
      .sort((team1, team2) => {
        return team1.points > team2.points;
      });

    return <Table columns={columns} dataSource={data} pagination={false} />;
  }
}

export default DisplayMatches;
