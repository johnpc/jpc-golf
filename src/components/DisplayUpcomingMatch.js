import React, {Component} from "react";
import {listPlayers, listMatchs} from "../graphql/queries";
import {API, graphqlOperation} from "aws-amplify";
import {Table, Alert, Select} from "antd";
import parseMatchData from "../utils/parseMatchData";
import {Link} from "react-router-dom";
const {Option} = Select;

class DisplayUpcomingMatch extends Component {
  state = {
    matches: [],
    players: [],
    player: {},
  };

  componentDidMount = async () => {
    const [matches, players] = await Promise.all([
      this.getMatches(),
      this.getPlayers(),
    ]);
    this.setState({
      matches,
      players,
    });
  };

  getMatches = async () => {
    const result = await API.graphql(graphqlOperation(listMatchs));
    return result.data.listMatchs.items.sort((match, match2) => {
      return Date.parse(match.date) > Date.parse(match2.date);
    });
  };

  getPlayers = async () => {
    const players = await API.graphql(graphqlOperation(listPlayers));
    return players.data.listPlayers.items;
  };

  render() {
    const {players, matches, playerId} = this.state;
    if (players.length === 0) {
      return <div>Loading... (no players found)</div>;
    }
    const playerSelectDropdown = (
      <Select
        showSearch
        style={{width: 500, padding: "50px"}}
        placeholder="Select a player"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={(value) => {
          const player = players.find(player => player.id === value)
          this.setState({player});
        }}
      >
        {players.map((player) => {
          return (
            <Option key={player.id} value={player.id}>
              {player.name}
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
              <Link to={`/players/${record.homePlayerId}`}>{playerName}</Link>
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
              <Link to={`/players/${record.awayPlayerId}`}>{playerName}</Link>
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
        if (playerId) {
          return (
            match.homeTeam.players.items.any(
              (player) => player.id === playerId
            ) ||
            match.awayTeam.players.items.any((player) => player.id === playerId)
          );
        }
        return true;
      })
      .filter((match) => {
        return (
          Date.parse(match.date) > new Date().getTime() &&
          Date.parse(match.date) <
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000
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
        <div style={{padding: "10px"}}>
          {playerSelectDropdown}
          <Alert message={this.state.player.name ? `No match scheduled for this week for ${this.state.player.name}.` : 'Please select a player to view their upcoming match.'} />
        </div>
      );
    }

    return (
      <div style={{padding: "10px"}}>
        {playerSelectDropdown}
        {matchJsx}
      </div>
    );
  }
}

export default DisplayUpcomingMatch;
