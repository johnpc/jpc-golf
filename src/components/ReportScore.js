import React, {useEffect, useState} from "react";
import createOrUpdateScore from "../data/createOrUpdateScore";
import {Select, InputNumber, Button, Spin, Form, Alert} from "antd";
import getMatches from "../data/getMatches";
import getPlayers from "../data/getPlayers";
const {Option} = Select;

function ReportScore() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  useEffect(() => {
    async function setupState() {
      const [matches, players] = await Promise.all([
        getMatches(),
        getPlayers(),
      ]);
      setMatches(matches);
      setPlayers(players);
    }
    setupState();
  }, []);

  const updateScore = async (values) => {
    if (!values.match || !values.player) {
      setError(
        "Please fill in all the required form fields to submit your score."
      );
      return;
    }

    if (
      !Number.isInteger(values.score) ||
      parseInt(values.score) > 36 ||
      parseInt(values.score) < -27
    ) {
      setError(
        "Please select a valid number for your score over/under par. Value must be between -27 and 36"
      );
      return;
    }

    setError(false);
    setLoading(true);

    await createOrUpdateScore(values.match, values.player, values.score);

    setSuccess(true);
    setLoading(false);
  };

  if (players.length === 0) {
    return <div>Loading... (no players found)</div>;
  }

  const playerSelectDropdown = (
    <Select
      showSearch
      style={{width: "80vw"}}
      placeholder="Select a player"
      optionFilterProp="children"
      onChange={(playerId) => {
        setSelectedPlayerId(playerId);
      }}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
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

  const matchSelectDropdown = (
    <Select
      showSearch
      disabled={!selectedPlayerId}
      style={{width: "80vw"}}
      placeholder="Select a date"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {matches
        .filter((match) => {
          return (
            match.homeTeam.players.items.find(
              (player) => player.id === selectedPlayerId
            ) ||
            match.awayTeam.players.items.find(
              (player) => player.id === selectedPlayerId
            )
          );
        })
        .map((match) => {
          return (
            <Option key={match.id} value={match.id}>
              {new Date(match.date).toDateString()}
            </Option>
          );
        })}
    </Select>
  );

  return (
    <div>
      {success ? (
        <Alert
          type="success"
          style={{margin: "1vw"}}
          message="Score submitted!"
        />
      ) : (
        ""
      )}
      {error ? (
        <Alert type="error" style={{margin: "1vw"}} message={error} />
      ) : (
        ""
      )}
      <h1>Submit your score</h1>
      <Form
        colon={false}
        initialValues={{remember: true}}
        onFinish={updateScore}
      >
        <Form.Item
          required
          tooltip="This is the player you are reporting the score on behalf of. Please be honest!"
          label="Player"
          name="player"
        >
          {playerSelectDropdown}
        </Form.Item>
        <Form.Item
          required
          tooltip="Select the match for the score you're reporting."
          label="Date"
          name="match"
        >
          {matchSelectDropdown}
        </Form.Item>
        <Form.Item
          required
          tooltip="Your score over/under par. Use negative values for scores below par."
          label="Score"
          name="score"
        >
          <InputNumber style={{width: "80vw"}} />
        </Form.Item>
        <Form.Item name="submit" style={{padding: "1vw 0"}}>
          <Button type="primary" htmlType="submit">
            {loading ? <Spin /> : "Report Score"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ReportScore;
