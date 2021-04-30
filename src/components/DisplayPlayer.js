import React, {Component} from "react";
import {Table} from "antd";
import getHandicap from "../utils/getHandicap";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import getPlayer from "../data/getPlayer";
class DisplayPlayer extends Component {
  state = {
    player: {},
  };

  componentDidMount = async () => {
    const player = await getPlayer(
      this.props.playerId ?? this.props.match.params.playerId
    );
    this.setState({
      player,
    });
  };

  render() {
    const columns = [
      {
        title: "Match Date",
        dataIndex: "matchDate",
        key: "matchDate",
        render: (text, record) => {
          return (
            <Link to={`/matches/match/${record.matchId}`}>
              {new Date(Date.parse(text)).toDateString()}
            </Link>
          );
        },
      },
      {
        title: "VS",
        dataIndex: "vs",
        key: "vs",
        render: (text, record) => {
          return <Link to={`/matches/${record.vsId}`}>{text}</Link>;
        },
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
          matchId: score.match.id,
          matchDate: score.match.date,
          vs:
            score.match.homeTeam.id === player.team.id
              ? score.match.awayTeam.name
              : score.match.homeTeam.name,
          vsId:
            score.match.homeTeam.id === player.team.id
              ? score.match.awayTeam.id
              : score.match.homeTeam.id,
          score: score.score,
          key: score.id,
        };
      })
      .sort((score1, score2) => {
        return Date.parse(score1.matchDate) > Date.parse(score2.matchDate);
      });

    return (
      <div style={{padding: "1vw"}}>
        <h1>{player.name}</h1>
        <h2>
          <Link to={`/matches/${player.team.id}`}>{player.team.name}</Link>
        </h2>
        <p>{getHandicap(player, new Date())} handicap</p>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    );
  }
}

export default withRouter(DisplayPlayer);
