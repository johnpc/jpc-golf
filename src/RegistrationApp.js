import "antd/dist/antd.css";
import DisplayInformation from "./components/DisplayInformation";
import Registration from "./components/Registration";
import {Switch, Route, Link} from "react-router-dom";
import {Layout, Menu} from "antd";

const {Header, Content, Footer} = Layout;

function RegistrationApp({match}) {
  const {url, path} = match;
  return (
    <div className="App">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="home">
            <Link to={url}>Register</Link>
          </Menu.Item>
          <Menu.Item key="preview">
            <Link to="/app">Preview</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{padding: "0 10vw"}}>
        <Switch>
          <Route exact path={path} component={Registration} />
        </Switch>
      </Content>
      <Footer style={{textAlign: "center"}}>GolfA2 ©2021</Footer>
    </div>
  );
}

export default RegistrationApp;
