import React, {Component} from "react";
import getMatches from "../data/getMatches";
import getTeams from "../data/getTeams";
import getScores from "../data/getScores";
import getPlayers from "../data/getPlayers";
class Admin extends Component {
  state = {
    teams: [],
    matches: [],
    scores: [],
    players: [],
  };

  componentDidMount = async () => {
    const [matches, players, scores, teams] = await Promise.all([
      getMatches(),
      getPlayers(),
      getScores(),
      getTeams(),
    ]);
    this.setState({
      matches,
      players,
      scores,
      teams,
    });
  };

  render() {
    return <div>Hello admin</div>;
  }
}

export default Admin;
