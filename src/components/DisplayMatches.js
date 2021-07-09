import React, {useState, useEffect} from "react";
import {Table, Alert, Empty, Spin, Tooltip, Select, Button} from "antd";
import parseMatchData from "../utils/parseMatchData";
import getMatches from "../data/getMatches";
import getPlayers from "../data/getPlayers";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import getTeams from "../data/getTeams";
import listenCreateScore from "../data/listenCreateScore";
import listenUpdateScore from "../data/listenUpdateScore";
import getCryptoValue from "../utils/getCryptoValue";
const {Option} = Select;

function DisplayMatches({match}) {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamId, setTeamId] = useState(match.params.teamId);
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({});
  const [matchId] = useState(match.params.matchId);
  const [prices, setPrices] = useState({});
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    async function setupState() {
      const [teams, matches, players] = await Promise.all([
        getTeams(),
        getMatches(),
        getPlayers(),
      ]);
      setTeams(teams);
      setPlayers(players);
      setMatches(matches);

      async function setupPrices() {
        let tempPrices = {};
        const promises = matches.map(async (match) => {
          const p = ["BTC", "ETH", "DOGE", "ADA"].map(async (crypto) => {
            const price = await getCryptoValue(crypto, match.date);
            if (price && price !== "N/A") {
              if (!tempPrices[match.date]) {
                const mapping = {};
                mapping[crypto] = price;
                tempPrices[match.date] = mapping;
              } else {
                tempPrices[match.date][crypto] = price;
              }
            }
          });
          return await Promise.all(p);
        });

        await Promise.all(promises);
        setPrices(tempPrices);
      }
      if (!Object.keys(prices).length) {
        await setupPrices();
      }
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
  const playerSelectDropdown = (
    <Select
      showSearch
      style={{width: "80vw", padding: "1vw 0"}}
      placeholder="Select a player"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={(value) => {
        const player = players.find((player) => player.id === value);
        setPlayer(player);
        setTeamId(null);
      }}
    >
      {players.map((player) => {
        return (
          <Option key={player.id} value={player.id}>
            {player.name} - {player.team.name}
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
        const isTie = ["=", "-"].includes(record.vs);
        const isWinner =
          !isTie && record.vs === "⬅️" && record.homeName === playerName;
        playerName = isWinner ? `${playerName} 🎉` : playerName;

        if (record.homePlayerId) {
          return (
            <Link to={`/app/players/${record.homePlayerId}`}>{playerName}</Link>
          );
        } else if (record.homeTeamId) {
          const cryptoMatch = ["BTC", "ETH", "DOGE", "ADA"].find((crypto) =>
            playerName.includes(crypto)
          );
          const price =
            cryptoMatch && prices[record.matchDate]
              ? prices[record.matchDate][cryptoMatch]
              : false;
          if (cryptoMatch && price) {
            return (
              <Tooltip
                title={`${cryptoMatch} was ${price} on ${new Date(
                  record.matchDate
                ).toDateString()}.`}
              >
                <Link
                  onClick={() => {
                    setPlayer({});
                    setTeamId(record.homeTeamId);
                  }}
                  to={`/app/matches/${record.homeTeamId}`}
                >
                  <b>{playerName}</b>
                </Link>
              </Tooltip>
            );
          } else {
            return (
              <Link
                onClick={() => {
                  setPlayer({});
                  setTeamId(record.homeTeamId);
                }}
                to={`/app/matches/${record.homeTeamId}`}
              >
                <b>{playerName}</b>
              </Link>
            );
          }
        }
        return playerName;
      },
    },
    {
      title: "Handicap",
      dataIndex: "homeHandicap",
      key: "homeHandicap",
      responsive: ["lg"],
    },
    {
      title: "Raw Score",
      dataIndex: "homeRaw",
      key: "homeRaw",
      responsive: ["lg"],
    },
    {
      title: "Adj Score",
      dataIndex: "homeAdj",
      key: "homeAdj",
      responsive: ["md"],
    },
    {
      title: "VS",
      dataIndex: "vsWithDifference",
      key: "vsWithDifference",
      className: "ant-tooltip-inner",
    },
    {
      title: "Name",
      dataIndex: "awayName",
      key: "awayName",
      render: (playerName, record) => {
        const isTie = ["=", "-"].includes(record.vs);
        const isWinner =
          !isTie && record.vs === "➡️" && record.awayName === playerName;
        playerName = isWinner ? `${playerName} 🎉` : playerName;
        if (record.awayPlayerId) {
          return (
            <Link to={`/app/players/${record.awayPlayerId}`}>{playerName}</Link>
          );
        } else if (record.awayTeamId) {
          const cryptoMatch = ["BTC", "ETH", "DOGE", "ADA"].find((crypto) =>
            playerName.includes(crypto)
          );
          const price =
            cryptoMatch && prices[record.matchDate]
              ? prices[record.matchDate][cryptoMatch]
              : false;
          if (cryptoMatch && price) {
            return (
              <Tooltip
                title={`${cryptoMatch} was ${price} on ${new Date(
                  record.matchDate
                ).toDateString()}.`}
              >
                <Link
                  onClick={() => {
                    setPlayer({});
                    setTeamId(record.awayTeamId);
                  }}
                  to={`/app/matches/${record.awayTeamId}`}
                >
                  <b>{playerName}</b>
                </Link>
              </Tooltip>
            );
          } else {
            return (
              <Link to={`/app/matches/${record.awayTeamId}`}>
                <b>{playerName}</b>
              </Link>
            );
          }
        }
        return playerName;
      },
    },
    {
      title: "Handicap",
      dataIndex: "awayHandicap",
      key: "awayHandicap",
      responsive: ["lg"],
    },
    {
      title: "Raw Score",
      dataIndex: "awayRaw",
      key: "awayRaw",
      responsive: ["lg"],
    },
    {
      title: "Adj Score",
      dataIndex: "awayAdj",
      key: "awayAdj",
      responsive: ["md"],
    },
    {
      title: "Adj Score",
      dataIndex: "awayAdj",
      key: "awayAdj",
      responsive: ["sm"],
    },
  ];

  if (matches.length === 0) {
    return <Spin />;
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
    .filter((match) => {
      if (player.id) {
        return (
          match.homeTeam.players.items.some(
            (matchPlayer) => player.id === matchPlayer.id
          ) ||
          match.awayTeam.players.items.some(
            (matchPlayer) => player.id === matchPlayer.id
          )
        );
      }
      return true;
    })
    .filter((match) => {
      switch (filterType) {
        case "past":
          return Date.parse(match.date) < Date.now();
        case "upcoming":
          return Date.parse(match.date) > Date.now();
        default:
          return true;
      }
    })
    .sort((match1, match2) => {
      if (filterType === "past") {
        return Date.parse(match2.date) - Date.parse(match1.date);
      }
      return Date.parse(match1.date) - Date.parse(match2.date);
    })
    .map((match) => {
      const data = parseMatchData(match);
      const homePoints = data.filter((datum) => datum.vs === "⬅️").length;
      const awayPoints = data.filter((datum) => datum.vs === "➡️").length;
      const pointsAwardedJsx =
        [match.homeTeam, match.awayTeam].some((team) => !team) ||
        Date.parse(match.date) > Date.now() ? (
          ""
        ) : (
          <>
            <Alert
              message={
                homePoints >= awayPoints
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
            {Date.parse(match.date) < Date.now() ? (
              <Link to={`/app/matches/match/${match.id}`}>
                {match.homeTeam?.name} vs {match.awayTeam?.name}:{" "}
                {new Date(match.date).toDateString()}
              </Link>
            ) : (
              <div>
                {match.homeTeam?.name} vs {match.awayTeam?.name}:{" "}
                {new Date(match.date).toDateString()}
              </div>
            )}
          </h1>
          {pointsAwardedJsx}
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      );
    });
  let headerContent = `Matches (${matchJsx.length})`;
  if (matchId) {
    const match = matches.find((match) => match.id === matchId);
    headerContent = `${match.homeTeam.name} vs ${
      match.awayTeam.name
    } on ${new Date(Date.parse(match.date)).toDateString()}`;
  }
  if (teamId || player.name) {
    const team = teams.find((team) => team.id === teamId);
    headerContent = (
      <div>
        <h1>
          Matches played by {player.name ? player.name : team.name + " "} (
          {matchJsx.length})
          <small>
            <Link
              to={"/app/matches"}
              onClick={() => {
                setTeamId(null);
                setPlayer({});
                setFilterType("all");
              }}
            >
              (reset filter)
            </Link>
          </small>
        </h1>
      </div>
    );
  }
  const filterJsx = (
    <>
      <Button onClick={() => setFilterType("all")}>All</Button>
      <Button onClick={() => setFilterType("upcoming")}>Upcoming</Button>
      <Button onClick={() => setFilterType("past")}>Past</Button>
    </>
  );
  return (
    <>
      {headerContent}
      {playerSelectDropdown}
      {filterJsx}
      {matchJsx.length === 0 ? <Empty /> : matchJsx}
    </>
  );
}

export default withRouter(DisplayMatches);
