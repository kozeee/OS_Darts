import { TableRow, TableCell } from "flowbite-react";

const PlayerRow = (props) => {
  return (
    <TableRow>
      <TableCell>{props.Name}</TableCell>
      <TableCell>{props.Membership}</TableCell>
    </TableRow>
  );
};

export default PlayerRow;
