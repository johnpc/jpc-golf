import {MS_PER_DAY} from "./setMatchSchedule";
const getCryptoValue = async (teamName, date) => {
  // This year, there are no crypto-named teams.
  return "";
  if (Date.parse(date) > Date.now() + MS_PER_DAY) {
    // no-op if it's a date in the future
    return "";
  }

  const result = await fetch(
    `https://yzqxj2osa7.execute-api.us-east-1.amazonaws.com/develop/crypto/${teamName}/${date}`
  );
  const json = await result.json();
  return json.dollarValue;
};

export default getCryptoValue;
