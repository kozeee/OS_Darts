import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Players from "./Players";
import BarList from "./BarList";

const PlayerTable = () => {
  const [report, setReport] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/points/allReport")
      .then((response) => response.json())
      .then((data) => setReport(data));
  };

  return (
    <div>
      <Table striped>
        <TableHead>
          <TableHeadCell>Player</TableHeadCell>
          <TableHeadCell>Member</TableHeadCell>
          <TableHeadCell>Total</TableHeadCell>
          <BarList></BarList>
        </TableHead>
        <TableBody>
          <Players items={report}></Players>
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerTable;
