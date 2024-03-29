import React, { useState } from "react";
import PlayerSelect from "./PlayerSelect";
import { Button, Select } from "flowbite-react";

const PlayerSelectX = ({ playerName }) => {
  // Your PlayerSelect component logic here
  return <PlayerSelect></PlayerSelect>;
};

const FormWithPlayerSelects = () => {
  const [playerSelects, setPlayerSelects] = useState([]);

  const handleDuplicate = () => {
    // Create a new PlayerSelect instance and add it to the array
    setPlayerSelects((prevSelects) => [
      ...prevSelects,
      <PlayerSelectX key={prevSelects.length} />,
    ]);
  };

  const handleRemove = (indexToRemove) => {
    // Remove the PlayerSelect component at the specified index
    setPlayerSelects((prevSelects) =>
      prevSelects.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div>
      {playerSelects.map((playerSelect, index) => (
        <div className="flex flex-row gap-4" key={index}>
          <Select name={"w" + index}>{playerSelect}</Select>
          <Select name={"p" + index}>
            <option value={1}>1st</option>
            <option value={2}>2nd</option>
            <option value={4}>top 4</option>
            <option value={8}>top 8</option>
            <option value={16}>top 16</option>
            <option value={32}>top 32</option>
          </Select>

          <Button color="Red" onClick={() => handleRemove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button color="Failure" onClick={handleDuplicate}>
        Add Player
      </Button>
    </div>
  );
};

export default FormWithPlayerSelects;
