import PlayerRow from "./PlayerRow";

const Players = ({ items }) => {
  console.log(items);
  return items.map(({ FullName, Membership }) => {
    return (
      <PlayerRow
        key={FullName}
        Name={FullName}
        Membership={Membership.toString()}
      />
    );
  });
};

export default Players;
