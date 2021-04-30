import React, {Component} from "react";
import {listPlayers, listMatchs, listScores} from "../graphql/queries";
import {createScore, updateScore} from "../graphql/mutations";
import {API, graphqlOperation} from "aws-amplify";
import {Select, InputNumber, Button, Spin, Form, Alert} from "antd";
const {Option} = Select;

class ReportScore extends Component {
  state = {
    players: [],
    matches: [],
    scores: [],
    loading: false,
    error: false,
    success: null,
  };

  componentDidMount = async () => {
    const [matches, players, scores] = await Promise.all([
      this.getMatches(),
      this.getPlayers(),
      this.getScores(),
    ]);
    this.setState({
      matches,
      players,
      scores,
    });
  };

  getPlayers = async () => {
    const players = await API.graphql(graphqlOperation(listPlayers));
    return players.data.listPlayers.items;
  };

  getMatches = async () => {
    const result = await API.graphql(graphqlOperation(listMatchs));
    return result.data.listMatchs.items.sort((match, match2) => {
      return Date.parse(match.date) > Date.parse(match2.date);
    });
  };

  getScores = async () => {
    const result = await API.graphql(graphqlOperation(listScores));
    return result.data.listScores.items;
  };

  updateScore = async (values) => {
    if (!values.match || !values.player) {
      this.setState({
        error:
          "Please fill in all the required form fields to submit your score.",
      });
      return;
    }

    if (
      !Number.isInteger(values.score) ||
      parseInt(values.score) > 36 ||
      parseInt(values.score) < -27
    ) {
      this.setState({
        error:
          "Please select a valid number for your score over/under par. Value must be between -27 and 36",
      });
      return;
    }

    this.setState({
      error: false,
      loading: true,
    });

    const existingScore = this.state.scores.find((score) => {
      console.log("JC", score);
      return (
        score.match.id === values.match && score.player.id === values.player
      );
    });

    if (existingScore) {
      await API.graphql(
        graphqlOperation(updateScore, {
          input: {
            id: existingScore.id,
            score: values.score,
            scoreMatchId: values.match,
            scorePlayerId: values.player,
          },
        })
      );
    } else {
      await API.graphql(
        graphqlOperation(createScore, {
          input: {
            score: values.score,
            scoreMatchId: values.match,
            scorePlayerId: values.player,
          },
        })
      );
    }

    this.setState({
      success: true,
      loading: false,
    });
  };

  render() {
    const {players, matches, loading, success, error} = this.state;
    if (players.length === 0 || matches.length === 0) {
      return <div>Loading... (no players found)</div>;
    }

    const playerSelectDropdown = (
      <Select
        showSearch
        style={{width: "80vw"}}
        placeholder="Select a player"
        optionFilterProp="children"
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
        style={{width: "80vw"}}
        placeholder="Select a date"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {matches.map((match) => {
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
          onFinish={this.updateScore}
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
}

export default ReportScore;
