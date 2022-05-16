import deleteMatches from "../data/deleteMatches";

async function nukeMatches() {
  console.warn("Initiating match removal. This is not a test.");
  await deleteMatches();
}

export default nukeMatches;
