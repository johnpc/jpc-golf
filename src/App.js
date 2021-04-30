import "antd/dist/antd.css";
import ReportScore from "./components/ReportScore";
import DisplayPlayer from "./components/DisplayPlayer";
import DisplayMatches from "./components/DisplayMatches";
import DisplayDirectory from "./components/DisplayDirectory";
import DisplayLeaderboard from "./components/DisplayLeaderboard";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

Amplify.configure(aws_exports);

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Report Your Score</Link>
            </li>
            <li>
              <Link to="/matches">View Past/Upcoming Matches</Link>
            </li>
            <li>
              <Link to="/directory">Player Directory</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/matches/:teamId">
            <DisplayMatches />
          </Route>
          <Route path="/matches">
            <DisplayMatches />
          </Route>
          <Route path="/players/:playerId">
            <DisplayPlayer />
          </Route>
          <Route path="/directory">
            <DisplayDirectory />
          </Route>
          <Route path="/">
            <ReportScore />
            <DisplayLeaderboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
