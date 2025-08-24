import { useEffect, useState } from "react";

export default function useBarList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/Bar/all")
      .then((response) => response.json())
      .then((resJson) => setItems(resJson));
  }, []);

  return items;
}
