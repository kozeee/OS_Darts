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
import barList from "./barList";

function getBars() {
  const items = barList();
  return items.map((item, i) => {
    return <TableHeadCell key={i}>{item.Name}</TableHeadCell>;
  });
}

const PlayerTable = () => {
  const [report, setReport] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/points/allReport")
      .then((response) => response.json())
      .then((data) => setReport(data));
    return;
  };

  return (
    <div>
      <Table striped>
        <TableHead>
          <TableHeadCell>Player</TableHeadCell>
          <TableHeadCell>Member</TableHeadCell>
          <TableHeadCell>Total</TableHeadCell>
          {getBars()}
        </TableHead>
        <TableBody>
          <Players items={report}></Players>
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerTable;
