import { useEffect, useState } from "react";
import { Select, TextInput } from "flowbite-react";

export default function PlayerSelect({ counts }) {
  const [items, setItems] = useState([]);
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
        console.log("PlayerSelect data:", data); // Debug log
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setError(error.message);
      });
  }, []);

  function getPlayers() {
    if (error) {
      return <option value="">Error loading players</option>;
    }

    if (items.length === 0) {
      return <option value="">No players available</option>;
    }

    return items
      .map((item, i) => {
        // Make sure we have a valid _id and name
        if (!item._id || (!item.Name && !item.FullName)) {
          console.warn("Invalid player item:", item);
          return null;
        }

        return (
          <option key={item._id} value={item._id}>
            {item.FullName || item.Name}
          </option>
        );
      })
      .filter(Boolean); // Remove null items
  }

  return <>{getPlayers()}</>;
}
