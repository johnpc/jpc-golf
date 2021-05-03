import React, {useState, useEffect} from "react";
import getTeams from "../data/getTeams";
import listenCreateScore from "../data/listenCreateScore";
import listenUpdateScore from "../data/listenUpdateScore";
import {Table} from "antd";
import parseMatchData from "../utils/parseMatchData";
import {Link} from "react-router-dom";

function DisplayLeaderboard() {
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    async function setupState() {
      const teams = await getTeams();
      setTeams(teams);
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
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
      render: (teamName, record) => {
        return (
          <Link to={`/app/matches/${record.teamId}`}>{teamName}</Link>
        );
      },
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
    },
  ];

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
        teamId: team.id,
      };
    })
    .sort((team1, team2) => {
      return team1.points - team2.points;
    });

  return (
    <>
      <h1>Leaderboard:</h1>
      <Table
        style={{padding: "1vw"}}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </>
  );
}

export default DisplayLeaderboard;
