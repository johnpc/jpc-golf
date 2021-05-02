import "antd/dist/antd.css";
import DisplayInformation from "./components/DisplayInformation";
import Registration from "./components/Registration";
import {BrowserRouter as Switch, Route, Link} from "react-router-dom";
import {Layout, Menu} from "antd";

const {Header, Content, Footer} = Layout;

function RegistrationApp({match}) {
  return (
    <div className="App">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="home">
            <Link to={match.url + "/"}>Register</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to={match.url + "/info"}>About</Link>
          </Menu.Item>
          <Menu.Item key="preview">
            <Link to="/app">Preview</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{padding: "0 10vw"}}>
        <Switch>
          <Route path={match.url + "/info"} component={DisplayInformation} />
          <Route path={match.url + "/"} component={Registration} />
        </Switch>
      </Content>
      <Footer style={{textAlign: "center"}}>John Corser ©2021</Footer>
    </div>
  );
}

export default RegistrationApp;
