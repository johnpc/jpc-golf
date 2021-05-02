import React, {useState, useEffect} from "react";
import {Table, Alert, Empty} from "antd";
import parseMatchData from "../utils/parseMatchData";
import getMatches from "../data/getMatches";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import getTeams from "../data/getTeams";
import listenCreateScore from "../data/listenCreateScore";
import listenUpdateScore from "../data/listenUpdateScore";

function DisplayMatches({match}) {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamId] = useState(match.params.teamId);
  const [matchId] = useState(match.params.matchId);
  useEffect(() => {
    async function setupState() {
      const teams = await getTeams();
      const matches = await getMatches();
      setTeams(teams);
      setMatches(matches);
    }
    setupState();
    const createScoreListener = listenCreateScore().subscribe({
      next: setupState,
    });

    const updateScoreListener = listenUpdateScore().subscribe({
      next: setupState,
    });
    return () => {
      updateScoreListener.unsubscribe();
      createScoreListener.unsubscribe();
    };
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "homeName",
      key: "homeName",
      render: (playerName, record) => {
        if (record.homePlayerId) {
          return (
            <Link to={`/app/players/${record.homePlayerId}`}>{playerName}</Link>
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
            <Link to={`/app/players/${record.awayPlayerId}`}>{playerName}</Link>
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

  if (matches.length === 0) {
    return <div>Loading... (no matches found)</div>;
  }

  const matchJsx = matches
    .filter((match) => {
      if (teamId) {
        return match.homeTeam?.id === teamId || match.awayTeam?.id === teamId;
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
      const pointsAwardedJsx = [match.homeTeam, match.awayTeam].some(
        (team) => !team
      ) ? (
        ""
      ) : (
        <>
          <Alert
            message={
              homePoints > awayPoints
                ? `${match.homeTeam?.name} is awarded ${homePoints} points`
                : `${match.awayTeam?.name} is awarded ${awayPoints} points`
            }
            type="success"
          />
          <Alert
            message={
              homePoints < awayPoints
                ? `${match.homeTeam?.name} is awarded ${homePoints} points`
                : `${match.awayTeam?.name} is awarded ${awayPoints} points`
            }
            type="info"
          />
        </>
      );
      return (
        <div style={{padding: "1vw"}} key={match.id}>
          <h1>
            {match.homeTeam?.name} vs {match.awayTeam?.name}:{" "}
            {new Date(match.date).toDateString()}
          </h1>
          {pointsAwardedJsx}
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      );
    });

  let headerContent = "Matches";
  if (matchId) {
    const match = matches.find((match) => match.id === matchId);
    headerContent = `${match.homeTeam.name} vs ${
      match.awayTeam.name
    } on ${new Date(Date.parse(match.date)).toDateString()}`;
  }
  if (teamId) {
    const team = teams.find((team) => team.id === teamId);
    headerContent = `Matches played by ${team.name}`;
  }
  return (
    <>
      <h1>{headerContent}</h1>
      {matchJsx.length === 0 ? <Empty /> : matchJsx}
    </>
  );
}

export default withRouter(DisplayMatches);
