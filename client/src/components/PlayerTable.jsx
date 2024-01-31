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
import BarList from "./BarList";

const PlayerTable = () => {
  const [items, setItems] = useState([]);
  const [bars, setBars] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/points/all")
      .then((response) => response.json())
      .then((resJson) => setItems(resJson));
  };

  return (
    <div>
      <Table striped>
        <TableHead>
          <TableHeadCell>Player</TableHeadCell>
          <TableHeadCell>Member</TableHeadCell>
          <BarList></BarList>
        </TableHead>
        <TableBody>
          <Players items={items}></Players>
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerTable;
