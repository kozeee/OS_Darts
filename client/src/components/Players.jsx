import PlayerRow from "./PlayerRow";

const Players = ({ items, barNames }) => {
  if (!Array.isArray(items)) {
    return null;
  }
  
  return items.map((item, i) => {
    return (
      <PlayerRow key={i} player={item} Name={item.Name} barNames={barNames} />
    );
  });
};

export default Players;
