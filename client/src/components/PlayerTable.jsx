import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import Players from "./Players";

const PlayerTable = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/player/all")
      .then((response) => response.json())
      .then((resJson) => setItems(resJson));
  };

  return (
    <div>
      <Table striped>
        <TableHead>
          <TableHeadCell>Player</TableHeadCell>
          <TableHeadCell>Membership</TableHeadCell>
        </TableHead>
        <TableBody>
          <Players items={items}></Players>
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerTable;
