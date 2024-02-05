import { useEffect, useState } from "react";
import { Select, TextInput } from "flowbite-react";

export default function PlayerSelect({ counts }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/player/all")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  function getPlayers() {
    return items.map((item, i) => {
      return (
        <option key={item.FullName} value={item.FullName}>
          {item.FullName}
        </option>
      );
    });
  }

  return <>{getPlayers()}</>;
}
