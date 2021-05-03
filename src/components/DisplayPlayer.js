import React, {useState, useEffect} from "react";
import {Empty, Table} from "antd";
import getHandicap from "../utils/getHandicap";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import getPlayer from "../data/getPlayer";

function DisplayPlayer(props) {
  const [player, setPlayer] = useState({});
  useEffect(() => {
    async function syncState() {
      const player = await getPlayer(
        props.playerId ?? props.match.params.playerId
      );
      setPlayer(player);
    }
    syncState();
  }, [props.playerId, props.match.params.playerId]);

  const columns = [
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      render: (text, record) => {
        return (
          <Link to={`/app/matches/match/${record.matchId}`}>
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
        if (record.vsId) {
          return <Link to={`/app/matches/${record.vsId}`}>{text}</Link>;
        }
        return text;
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
  ];

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
            ? score.match.awayTeam?.name ?? "No opponent"
            : score.match.homeTeam?.name ?? "No opponent",
        vsId:
          score.match.homeTeam.id === player.team.id
            ? score.match.awayTeam?.id
            : score.match.homeTeam?.id,
        score: score.score,
        key: score.id,
      };
    })
    .sort((score1, score2) => {
      return Date.parse(score1.matchDate) > Date.parse(score2.matchDate);
    });

  const content =
    player.scores.items.length === 0 ? (
      <Empty />
    ) : (
      <Table columns={columns} dataSource={data} pagination={false} />
    );
  return (
    <div style={{padding: "1vw"}}>
      <h1>{player.name}</h1>
      <h2>
        <Link to={`/app/matches/${player.team.id}`}>{player.team.name}</Link>
      </h2>
      <p>{getHandicap(player, new Date())} handicap</p>
      {content}
    </div>
  );
}

export default withRouter(DisplayPlayer);
