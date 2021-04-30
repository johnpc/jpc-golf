import 'antd/dist/antd.css';
import DisplayMatches from "./components/DisplayMatches";
import DisplayLeaderboard from "./components/DisplayLeaderboard";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
Amplify.configure(aws_exports);

function App() {
  return (
    <div className="App">
      <DisplayLeaderboard />
    </div>
  );
}

export default App;
