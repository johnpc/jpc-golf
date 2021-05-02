import "antd/dist/antd.css";
import Admin from "./components/Admin";
import ReportScore from "./components/ReportScore";
import DisplayPlayer from "./components/DisplayPlayer";
import DisplayMatches from "./components/DisplayMatches";
import DisplayDirectory from "./components/DisplayDirectory";
import DisplayInformation from "./components/DisplayInformation";
import DisplayLeaderboard from "./components/DisplayLeaderboard";
import DisplayUpcomingMatch from "./components/DisplayUpcomingMatch";
import {BrowserRouter as Switch, Route, Link} from "react-router-dom";
import {Layout, Menu} from "antd";

const {Header, Content, Footer} = Layout;

function MainApp({match}) {
  return (
    <div className="App">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="home">
            <Link to={match.url + "/"}>Report Your Score</Link>
          </Menu.Item>
          <Menu.Item key="matches">
            <Link to={match.url + "/matches"}>All Matches</Link>
          </Menu.Item>
          <Menu.Item key="directory">
            <Link to={match.url + "/directory"}>Player Directory</Link>
          </Menu.Item>
          <Menu.Item key="upcoming">
            <Link to={match.url + "/upcoming"}>Upcoming Match</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to={match.url + "/about"}>About</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{padding: "0 10vw"}}>
        <Switch>
          <Route path={match.url + "/admin"} component={Admin} />
          <Route
            path={match.url + "/matches/match/:matchId"}
            component={DisplayMatches}
          />
          <Route
            path={match.url + "/matches/:teamId"}
            component={DisplayMatches}
          />
          <Route path={match.url + "/matches"} component={DisplayMatches} />
          <Route
            path={match.url + "/upcoming"}
            component={DisplayUpcomingMatch}
          />
          <Route
            path={match.url + "/players/:playerId"}
            component={DisplayPlayer}
          />
          <Route path={match.url + "/directory"} component={DisplayDirectory} />
          <Route path={match.url + "/about"} component={DisplayInformation} />
          <Route path={match.url}>
            <ReportScore />
            <DisplayLeaderboard match={match} />
          </Route>
        </Switch>
      </Content>
      <Footer style={{textAlign: "center"}}>John Corser ©2021</Footer>
    </div>
  );
}

export default MainApp;
