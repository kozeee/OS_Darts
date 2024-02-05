import { useEffect, useState } from "react";
import { Select } from "flowbite-react";

export default function BarSelect() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("/api/bar/all")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  function getBars() {
    return items.map((item, i) => {
      return (
        <option key={item.Name} value={item.name}>
          {item.Name}
        </option>
      );
    });
  }

  return (
    <Select name="Bar" id="barLocation">
      <option value="">Any</option>
      {getBars()}
    </Select>
  );
}
