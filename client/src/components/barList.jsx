import { useEffect, useState } from "react";
import { TableHeadCell } from "flowbite-react";

export default function BarList() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/bar/all")
      .then((response) => response.json())
      .then((resJson) => setItems(resJson));
  };

  function getBars() {
    return items.map((item, i) => {
      return <TableHeadCell>{item.Name}</TableHeadCell>;
    });
  }

  return getBars();
}
