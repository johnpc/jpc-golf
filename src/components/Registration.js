import React, {useState, useEffect} from "react";
import createPlayer from "../data/createPlayer";
import createTeam from "../data/createTeam";
import getPlayers from "../data/getPlayers";
import getTeams from "../data/getTeams";
import {Input, Button, Spin, Form, Alert} from "antd";
import listenCreateTeam from "../data/listenCreateTeam";
import listenCreateScore from "../data/listenCreateScore";
import listenUpdateScore from "../data/listenUpdateScore";

function Registration() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function setupState() {
      const [teams, players] = await Promise.all([getTeams(), getPlayers()]);
      setTeams(teams);
      setPlayers(players);
    }
    setupState();
    const createScoreListener = listenCreateScore().subscribe({
      next: setupState,
    });

    const updateScoreListener = listenUpdateScore().subscribe({
      next: setupState,
    });
    const createTeamListener = listenCreateTeam().subscribe({
      next: setupState,
    });

    return () => {
      updateScoreListener.unsubscribe();
      createScoreListener.unsubscribe();
      createTeamListener.unsubscribe();
    };
  }, []);

  const validatePhoneNumber = (number) => {
    return Number.isInteger(parseInt(number)) && number.length === 10;
  };

  // Lifted from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const validateEmailAddress = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const createTeamSubmit = async (values) => {
    if (
      Object.keys(values).some(
        (key) => !values[key] && !["submit", "ack"].includes(key)
      )
    ) {
      setError("Please make sure all required fields are set.");
      return;
    }

    if (values.ack === undefined) {
      setError("Please acknowlege payment is required.");
      return;
    }

    if (values.player1Name === values.player2Name) {
      setError("Cannot have two players with the same name on the same team.");
      return;
    }

    if (values.player1Phone === values.player2Phone) {
      setError("Cannot have two players with the same phone number.");
      return;
    }

    if (values.player1Email === values.player2Email) {
      setError("Cannot have two players with the same email.");
      return;
    }

    if (
      !validatePhoneNumber(values.player1Phone) ||
      !validatePhoneNumber(values.player2Phone)
    ) {
      setError("Phone numbers must be formatted like 9895987705.");
      return;
    }

    if (
      !validateEmailAddress(values.player1Email) ||
      !validateEmailAddress(values.player2Email)
    ) {
      setError("Provided email address is invalid");
      return;
    }

    if (
      players.some(
        (player) =>
          values.player1Email === player.email ||
          values.player2Email === player.email ||
          values.player1Phone === player.phone ||
          values.player2Phone === player.phone
      )
    ) {
      setError("A player with that email or phone is already registered");
      return;
    }

    if (teams.some((team) => team.name === values.teamName)) {
      setError("A team  with that name already exists.");
      return;
    }

    setLoading(true);
    setError(false);
    setSuccess(false);

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

    setLoading(false);
    setError(false);
    setSuccess(true);
  };

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
        onFinish={createTeamSubmit}
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
          tooltip="The league costs $106/person. Check this box to note that you understand that by registering, you will be responsible for paying this fee before the league kicks off. Failure to pay in advance will result in you losing your position in the league."
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

export default Registration;
