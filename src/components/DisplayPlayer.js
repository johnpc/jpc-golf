import React, {Component} from "react";
import {getPlayer} from "../graphql/queries";
import {API, graphqlOperation} from "aws-amplify";
import {Table} from "antd";
import getHandicap from "../utils/getHandicap";

class DisplayPlayer extends Component {
  state = {
    player: {},
  };

  componentDidMount = async () => {
    const player = await this.getPlayer();
    this.setState({
      player,
    });
  };

  getPlayer = async () => {
    const result = await API.graphql(
      graphqlOperation(getPlayer, {
        id: this.props.playerId,
        input: {id: this.props.playerId},
      })
    );
    return result.data.getPlayer;
  };

  render() {
    const columns = [
      {
        title: "Match Date",
        dataIndex: "matchDate",
        key: "matchDate",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "VS",
        dataIndex: "vs",
        key: "vs",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Score",
        dataIndex: "score",
        key: "score",
      },
    ];

    const {player} = this.state;
    if (!player.id) {
      return <div>Loading... (no player found)</div>;
    }

    const data = player.scores.items
      .map((score) => {
        return {
          matchDate: score.match.date,
          vs:
            score.match.homeTeam.id === player.team.id
              ? score.match.awayTeam.name
              : score.match.homeTeam.name,
          score: score.score,
          key: score.id,
        };
      })
      .sort((score1, score2) => {
        return Date.parse(score1.matchDate) > Date.parse(score2.matchDate);
      });

    return (
      <>
        <h1>{player.name}</h1>
        <h2>{player.team.name}</h2>
        <p>{getHandicap(player, new Date())} handicap</p>
        <Table columns={columns} dataSource={data} pagination={false} />
      </>
    );
  }
}

export default DisplayPlayer;
