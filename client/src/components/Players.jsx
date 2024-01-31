import PlayerRow from "./PlayerRow";

const Players = ({ items }) => {
  return items.map((player) => {
    return <PlayerRow player={player} key={player.Name} />;
  });
};

export default Players;
