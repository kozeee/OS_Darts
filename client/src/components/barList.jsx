import { useEffect, useState } from "react";
import { TableHeadCell } from "flowbite-react";

export default function barList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/bar/all")
      .then((response) => response.json())
      .then((resJson) => setItems(resJson));
  }, []);

  return items;
}
