import "antd/dist/antd.css";
import ReportScore from "./components/ReportScore";
import DisplayPlayer from "./components/DisplayPlayer";
import DisplayMatches from "./components/DisplayMatches";
import DisplayDirectory from "./components/DisplayDirectory";
import DisplayInformation from "./components/DisplayInformation";
import DisplayLeaderboard from "./components/DisplayLeaderboard";
import DisplayUpcomingMatch from "./components/DisplayUpcomingMatch";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Layout, Menu} from "antd";

const {Header, Content, Footer} = Layout;

Amplify.configure(aws_exports);

function App() {
  return (
    <Router>
      <div className="App">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/">Report Your Score</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/matches">View Past/Upcoming Matches</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/directory">Player Directory</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/info">About</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/upcoming-match">Upcoming Match</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{padding: "0 50px"}}>
          <Switch>
            <Route path="/matches/match/:matchId">
              <DisplayMatches />
            </Route>
            <Route path="/matches/:teamId">
              <DisplayMatches />
            </Route>
            <Route path="/matches">
              <DisplayMatches />
            </Route>
            <Route path="/upcoming-match">
              <DisplayUpcomingMatch />
            </Route>
            <Route path="/players/:playerId">
              <DisplayPlayer />
            </Route>
            <Route path="/directory">
              <DisplayDirectory />
            </Route>
            <Route path="/info">
              <DisplayInformation />
            </Route>
            <Route path="/">
              <ReportScore />
              <DisplayLeaderboard />
            </Route>
          </Switch>
        </Content>
        <Footer style={{textAlign: "center"}}>John Corser ©2021</Footer>
      </div>
    </Router>
  );
}

export default App;
