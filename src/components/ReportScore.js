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
    this.setState({
      loading: true,
    });

    const existingScore = this.state.scores.find(
      (score) =>
        score.match.id === values.match && score.player.id === values.player
    );

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
      loading: false,
    });
  };

  render() {
    const {players, matches, loading, success} = this.state;
    if (players.length === 0 || matches.length === 0) {
      return <div>Loading... (no players found)</div>;
    }

    const playerSelectDropdown = (
      <Select
        showSearch
        style={{width: 200}}
        placeholder="Select a player"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
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

    const matchSelectDropdown = (
      <Select
        showSearch
        style={{width: 200}}
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
      <div style={{padding: "50px"}}>
        {success ? <Alert message="Score submitted!" /> : ""}
        <Form layout="inline" initialValues={{remember: true}} onFinish={this.updateScore}>
          <Form.Item label="Player" name="player">
            {playerSelectDropdown}
          </Form.Item>
          <Form.Item label="Date" name="match">
            {matchSelectDropdown}
          </Form.Item>
          <Form.Item label="Score" name="score">
            <InputNumber min={-25} max={25} />
          </Form.Item>
          <Form.Item name="submit">
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
