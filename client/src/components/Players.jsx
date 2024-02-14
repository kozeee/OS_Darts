import PlayerRow from "./PlayerRow";

const Players = ({ items }) => {
  const playerNames = Object.keys(items);
  let playerMap = Object.values(items);
  return playerMap.map((item, i) => {
    return (
      <PlayerRow key={playerNames[i]} player={item} Name={playerNames[i]} />
    );
  });
};

export default Players;
