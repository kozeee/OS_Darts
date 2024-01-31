import { TableRow, TableCell } from "flowbite-react";

const PlayerRow = (props) => {
  let player = props.player;
  console.log(player);
  return (
    <TableRow>
      <TableCell>{player.Name}</TableCell>
      <TableCell>{player.Member.toString()}</TableCell>
      <TableCell>{player["rock falls"]}</TableCell>
      <TableCell>{player["murphy's law"]}</TableCell>
    </TableRow>
  );
};

export default PlayerRow;
