import React, {Component} from "react";
import {listMatchs} from "../graphql/queries";
import {API, graphqlOperation} from "aws-amplify";
import {Table, Alert} from "antd";
import parseMatchData from "../utils/parseMatchData";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";

class DisplayMatches extends Component {
  state = {
    matches: [],
    teamId: this.props.match.params.teamId,
    matchId: this.props.match.params.matchId,
  };

  componentDidMount = async () => {
    const matches = await this.getMatches();
    this.setState({
      matches,
    });
  };

  getMatches = async () => {
    const result = await API.graphql(graphqlOperation(listMatchs));
    return result.data.listMatchs.items.sort((match, match2) => {
      return Date.parse(match.date) > Date.parse(match2.date);
    });
  };

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "homeName",
        key: "homeName",
        render: (playerName, record) => {
          if (record.homePlayerId) {
            return <Link to={`/players/${record.homePlayerId}`}>{playerName}</Link>;
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
            return <Link to={`/players/${record.awayPlayerId}`}>{playerName}</Link>;
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

    const {matches, teamId, matchId} = this.state;
    if (matches.length === 0) {
      return <div>Loading... (no matches found)</div>;
    }

    return matches
      .filter((match) => {
        if (teamId) {
          return match.homeTeam.id === teamId || match.awayTeam.id === teamId;
        }
        return true;
      })
      .filter((match) => {
        if (matchId) {
          return match.id === matchId;
        }
        return true;
      })
      .map((match) => {
        const data = parseMatchData(match);
        const homePoints = data.filter((datum) => datum.vs === "⬅️").length;
        const awayPoints = data.filter((datum) => datum.vs === "➡️").length;

        return (
          <div style={{padding: "1vw"}} key={match.id}>
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
  }
}

export default withRouter(DisplayMatches);
