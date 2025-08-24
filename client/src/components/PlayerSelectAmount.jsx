import React, { useState, useEffect } from "react";
import { Button, Select } from "flowbite-react";

const FormWithPlayerSelects = ({ fieldPrefix = "w", initialData = [] }) => {
  const [playerSelects, setPlayerSelects] = useState([]);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/Player/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("PlayerSelectAmount data:", data);
        setPlayers(data);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setError(error.message);
      });
  }, []);

  // Initialize with existing data if provided (for editing)
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const formattedData = initialData.map((item, index) => ({
        id: Date.now() + index,
        winner: item.Name || "",
        position: item.Points || 1,
      }));
      setPlayerSelects(formattedData);
    }
  }, [initialData]);

  const handleDuplicate = () => {
    setPlayerSelects((prevSelects) => [
      ...prevSelects,
      { id: Date.now(), winner: "", position: 1 },
    ]);
  };

  const handleRemove = (indexToRemove) => {
    setPlayerSelects((prevSelects) =>
      prevSelects.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleWinnerChange = (index, value) => {
    setPlayerSelects((prevSelects) =>
      prevSelects.map((select, i) =>
        i === index ? { ...select, winner: value } : select
      )
    );
  };

  const handlePositionChange = (index, value) => {
    setPlayerSelects((prevSelects) =>
      prevSelects.map((select, i) =>
        i === index ? { ...select, position: parseInt(value) } : select
      )
    );
  };

  const getPlayerOptions = () => {
    if (error) {
      return <option value="">Error loading players</option>;
    }

    if (players.length === 0) {
      return <option value="">No players available</option>;
    }

    return players
      .map((item) => {
        if (!item._id || (!item.Name && !item.FullName)) {
          console.warn("Invalid player item:", item);
          return null;
        }

        return (
          <option key={item._id} value={item.FullName || item.Name}>
            {item.FullName || item.Name}
          </option>
        );
      })
      .filter(Boolean);
  };

  return (
    <div>
      {playerSelects.map((playerSelect, index) => (
        <div className="flex flex-row gap-4" key={playerSelect.id}>
          <Select
            name={`${fieldPrefix}${index}`}
            value={playerSelect.winner}
            onChange={(e) => handleWinnerChange(index, e.target.value)}
          >
            <option value="">Select a player</option>
            {getPlayerOptions()}
          </Select>
          <Select
            name={`p${index}`}
            value={playerSelect.position}
            onChange={(e) => handlePositionChange(index, e.target.value)}
          >
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
