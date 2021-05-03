import React from "react";
import ManageTeams from "./admin/ManageTeams";
import {Button} from "antd";
import setMatchSchedule from "../utils/setMatchSchedule";

function Admin() {
  return (
    <div>
      <Button onClick={() => setMatchSchedule()}>Generate matches</Button>
      <ManageTeams />
    </div>
  );
}

export default Admin;
