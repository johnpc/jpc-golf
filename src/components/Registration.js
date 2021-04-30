import React, {Component} from "react";
import createPlayer from "../data/createPlayer";
import createTeam from "../data/createTeam";
import getPlayers from "../data/getPlayers";
import getTeams from "../data/getTeams";
import {Input, Button, Spin, Form, Alert} from "antd";
import listenCreateTeam from "../data/listenCreateTeam";

class Registration extends Component {
  state = {
    success: false,
    error: false,
    loading: false,
    players: [],
    teams: [],
  };

  syncState = async () => {
    const players = await getPlayers();
    const teams = await getTeams();
    this.setState({
      players,
      teams,
    });
  };

  componentDidMount = async () => {
    this.syncState();

    this.createTeamListener = listenCreateTeam().subscribe({
      next: this.syncState,
    });
  };

  componentWillUnmount() {
    this.createTeamListener.unsubscribe();
  }

  validatePhoneNumber = (number) => {
    return Number.isInteger(parseInt(number)) && number.length === 10;
  };

  // Lifted from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  validateEmailAddress = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  createTeam = async (values) => {
    if (
      Object.keys(values).some(
        (key) => !values[key] && !["submit", "ack"].includes(key)
      )
    ) {
      this.setState({
        error: "Please make sure all required fields are set.",
      });
      return;
    }

    if (values.ack === undefined) {
      this.setState({
        error: "Please acknowlege payment is required.",
      });
      return;
    }

    if (values.player1Name === values.player2Name) {
      this.setState({
        error: "Cannot have two players with the same name on the same team.",
      });
      return;
    }

    if (values.player1Phone === values.player2Phone) {
      this.setState({
        error: "Cannot have two players with the same phone number.",
      });
      return;
    }

    if (values.player1Email === values.player2Email) {
      this.setState({
        error: "Cannot have two players with the same email.",
      });
      return;
    }

    if (
      !this.validatePhoneNumber(values.player1Phone) ||
      !this.validatePhoneNumber(values.player2Phone)
    ) {
      this.setState({
        error: "Phone numbers must be formatted like 9895987705.",
      });
      return;
    }

    if (
      !this.validateEmailAddress(values.player1Email) ||
      !this.validateEmailAddress(values.player2Email)
    ) {
      this.setState({
        error: "Provided email address is invalid",
      });
      return;
    }

    if (
      this.state.players.some(
        (player) =>
          values.player1Email === player.email ||
          values.player2Email === player.email ||
          values.player1Phone === player.phone ||
          values.player2Phone === player.phone
      )
    ) {
      this.setState({
        error: "A player with that email or phone is already registered",
      });
      return;
    }

    if (this.state.teams.some((team) => team.name === values.teamName)) {
      this.setState({
        error: "A team  with that name already exists.",
      });
      return;
    }

    this.setState({
      loading: true,
      error: false,
      success: false,
    });

    const team = await createTeam(values.teamName);
    await createPlayer(
      values.player1Name,
      team,
      values.player1Email,
      values.player1Phone
    );
    await createPlayer(
      values.player2Name,
      team,
      values.player2Email,
      values.player2Phone
    );

    this.setState({
      loading: false,
      error: false,
      success: true,
    });
  };

  render() {
    const {loading, success, error} = this.state;
    return (
      <div>
        {success ? (
          <Alert
            type="success"
            style={{margin: "1vw"}}
            message="You're registered!"
          />
        ) : (
          ""
        )}
        {error ? (
          <Alert type="error" style={{margin: "1vw"}} message={error} />
        ) : (
          ""
        )}
        <h1>Register to Join</h1>
        <Form
          colon={false}
          initialValues={{remember: true}}
          onFinish={this.createTeam}
        >
          <Form.Item
            required
            tooltip="You can name your team anything you like"
            label="Team Name"
            name="teamName"
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            required
            tooltip="Your full name"
            label="Your Name"
            name="player1Name"
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            required
            tooltip="Your email address"
            label="Your Email"
            name="player1Email"
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            required
            tooltip="Your phone number. Must be formatted like 9895987705"
            label="Your Phone"
            name="player1Phone"
          >
            <Input type="tel" />
          </Form.Item>

          <Form.Item
            required
            tooltip="Your partner's full name"
            label="Partner Name"
            name="player2Name"
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            required
            tooltip="Your partner's email address"
            label="Partner Email"
            name="player2Email"
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            required
            tooltip="Your partner's phone number. Must be formatted like 9895987705"
            label="Partner Phone"
            name="player2Phone"
          >
            <Input type="tel" />
          </Form.Item>

          <Form.Item
            required
            tooltip="The league costs $300/person. Check this box to note that you understand that by registering, you will be responsible for paying this fee before the league kicks off. Failure to pay in advance will result in you losing your position in the league."
            label="Acknowledge league fee"
            name="ack"
          >
            <Input type="checkbox" />
          </Form.Item>
          <Form.Item name="submit" style={{padding: "1vw 0"}}>
            <Button type="primary" htmlType="submit">
              {loading ? <Spin /> : "Register"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Registration;
