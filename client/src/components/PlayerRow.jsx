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
      <TableCell>{props.Name}</TableCell>
      <Unroll player={props.player}></Unroll>
    </TableRow>
  );
};

export default PlayerRow;
