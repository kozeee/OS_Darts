import PlayerRow from "./PlayerRow";

const Players = ({ items }) => {
  const playerNames = Object.keys(items);
  console.log(playerNames);
  let playerMap = Object.values(items);
  return playerMap.map((item, i) => {
    return <PlayerRow player={item} Name={playerNames[i]} />;
  });
};

export default Players;
