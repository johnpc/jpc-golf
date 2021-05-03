import "antd/dist/antd.css";
import Admin from "./components/Admin";
import MainApp from "./MainApp";
import RegistrationApp from "./RegistrationApp";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import React, {useEffect, useRef} from "react";
import { FIRST_MATCH_DATE, MS_PER_WEEK } from "./utils/setMatchSchedule";
Amplify.configure(aws_exports);

function App() {
  const appLink = useRef(null);
  const adminLink = useRef(null);
  const registrationLink = useRef(null);
  useEffect(() => {
    const navigate = async () => {
      if (window.location.pathname === "/") {
        // End registration a week prior to league start
        if (Date.now() > Date.parse(FIRST_MATCH_DATE - MS_PER_WEEK)) {
          appLink.current.click();
        }
        registrationLink.current.click();
      }
    };
    navigate();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/app" component={MainApp} />
        <Route path="/admin" component={Admin} />
        <Route path="/registration" component={RegistrationApp} />
      </Switch>
      <Link hidden ref={appLink} to="app">
        App
      </Link>
      <Link hidden ref={adminLink} to="admin">
        Admin
      </Link>
      <Link hidden ref={registrationLink} to="registration">
        Registration
      </Link>
    </Router>
  );
}

export default App;
