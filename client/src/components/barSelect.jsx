import { useEffect, useState } from "react";
import { Select } from "flowbite-react";
import barList from "./barList";

function getBars() {
  const items = barList();
  return items.map((item, i) => {
    return (
      <option key={item.Name} value={item.name}>
        {item.Name}
      </option>
    );
  });
}

export default function BarSelect() {
  return (
    <Select name="Bar" id="barLocation">
      <option value="">Any</option>
      {getBars()}
    </Select>
  );
}
