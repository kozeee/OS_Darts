import { TableRow, TableCell } from "flowbite-react";

const Unroll = (player) => {
  const playerItem = Object.values(player.player);
  console.log(playerItem);
  return playerItem.map((item) => <TableCell>{item.toString()}</TableCell>);
};

const PlayerRow = (props) => {
  console.log(props);
  return (
    <TableRow>
      <TableCell>
        <button
          className="underline"
          onClick={() => {
            updateMembership(props.Name);
          }}
        >
          {props.Name}
        </button>
      </TableCell>
      <Unroll player={props.player}></Unroll>
    </TableRow>
  );
};

const updateMembership = (player) => {
  let payload = { Name: player };
  fetch("/api/player/membership", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export default PlayerRow;
