import React, {useState, useEffect} from "react";
import {Empty, Table, Spin} from "antd";
import getHandicap from "../utils/getHandicap";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import getPlayer from "../data/getPlayer";
import getLowHandicap from "../utils/getLowHandicap";
import parseMatchData from "../utils/parseMatchData";

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
      title: "Handicap",
      dataIndex: "handicap",
      key: "handicap",
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
    {
      title: "Adj",
      dataIndex: "adj",
      key: "adj",
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
    },
  ];

  if (!player.id) {
    return <Spin />;
  }

  const data = player.scores.items
    .map((score) => {
      let result;
      const data = parseMatchData(score.match).find((data) =>
        [data.homePlayerId, data.awayPlayerId].includes(player.id)
      );
      const isHomePlayer = data.homePlayerId === player.id;
      switch (data.vs) {
        case "-":
          result = "N/A";
          break;
        case "=":
          result = "tie";
          break;
        case "➡️":
          result = isHomePlayer ? "lose" : "win 🎉";
          break;
        default:
          result = isHomePlayer ? "win 🎉": "lose";
      }
      return {
        matchId: score.match.id,
        matchDate: score.match.date,
        handicap: getHandicap(player, score.match.date),
        vs:
          score.match.homeTeam.id === player.team.id
            ? score.match.awayTeam?.name ?? "No opponent"
            : score.match.homeTeam?.name ?? "No opponent",
        vsId:
          score.match.homeTeam.id === player.team.id
            ? score.match.awayTeam?.id
            : score.match.homeTeam?.id,
        score: score.score,
        adj: parseFloat(
          (score.score - getHandicap(player, score.match.date)).toFixed(2)
        ),
        result,
        key: score.id,
      };
    })
    .sort((score1, score2) => {
      return Date.parse(score1.matchDate) - Date.parse(score2.matchDate);
    });

  const content =
    player.scores.items.length === 0 ? (
      <Empty />
    ) : (
      <Table columns={columns} dataSource={data} pagination={false} />
    );
  const partner = player.team.players.items.find((p) => p.id !== player.id);
  const handicap = getHandicap(player);
  const isLowHandicap =
    getLowHandicap(player.team.players.items).id === player.id;
  return (
    <div style={{padding: "1vw"}}>
      <h1>{player.name}</h1>
      <h2>
        Currently the {isLowHandicap ? "low" : "high"} handicap player on{" "}
        <Link to={`/app/matches/${player.team.id}`}>{player.team.name}</Link>
      </h2>
      <p>
        Partners with{" "}
        <Link to={`/app/players/${partner.id}`}>{partner.name}</Link>
      </p>
      <p>{handicap} handicap</p>
      {content}
    </div>
  );
}

export default withRouter(DisplayPlayer);
