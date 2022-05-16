import React, {useState} from "react";
import ManageTeams from "./admin/ManageTeams";
import {Button} from "antd";
import setMatchSchedule from "../utils/setMatchSchedule";
import seedData from "../utils/seedData";
import nukeData from "../utils/nukeData";
import {Link} from "react-router-dom";
import recordAnalytics from "../utils/recordAnalytics";
import nukeMatches from "../utils/nukeMatches";

function Admin() {
  const [seedDisabled, setSeedDisabled] = useState(false);
  const [nukeDisabled, setNukeDisabled] = useState(false);
  recordAnalytics('adminVisit');
  return (
    <div>
      <Link to="/app">
        <Button>Visit App</Button>
      </Link>
      <Link to="/registration">
        <Button>Registration</Button>
      </Link>
      <Button onClick={() => setMatchSchedule()}>Generate matches</Button>
      <Button
        disabled={seedDisabled}
        type="primary"
        onClick={async () => {
          setSeedDisabled(true);
          await seedData();
          setSeedDisabled(false);
        }}
      >
        Populate fake data
      </Button>
      <Button
        danger
        disabled={nukeDisabled}
        onClick={async () => {
          setNukeDisabled(true);
          nukeData();
          setNukeDisabled(false);
        }}
      >
        Nuke data
      </Button>
      <Button
        danger
        disabled={nukeDisabled}
        onClick={async () => {
          setNukeDisabled(true);
          nukeMatches();
          setNukeDisabled(false);
        }}
      >
        Remove All Matches
      </Button>
      <ManageTeams />
    </div>
  );
}

export default Admin;
