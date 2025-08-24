import { TableRow, TableCell, Button, Badge } from "flowbite-react";
import { useState } from "react";

function Unroll(player, barNames) {
  const playerItem = player.player;
  console.log("PlayerItem in Unroll:", playerItem);
  console.log("Bar names to match:", barNames);

  // Only show data for the specific bars that have headers
  // Use the bar names from the parent component to ensure exact alignment
  const barData = barNames.map((barName) => {
    const value = playerItem[barName.toLowerCase()] || 0;
    console.log(`Bar: ${barName}, Value: ${value}`);
    return { barName, value };
  });

  console.log("Filtered bar data:", barData);

  return barData.map(({ barName, value }, i) => (
    <td key={barName + i} className="text-center w-24 px-4 py-3">
      {typeof value === "number" ? (
        <Badge color="purple" size="sm">
          {value.toFixed(2)}
        </Badge>
      ) : (
        <span className="text-gray-700">{value.toString()}</span>
      )}
    </td>
  ));
}

const PlayerRow = (props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("PlayerRow props:", props);
  console.log("Player data:", props.player);

  const updateMembership = async (player) => {
    setIsUpdating(true);
    try {
      let payload = { Name: player };
      const response = await fetch("/api/Player/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Membership updated successfully!");
        // Optionally refresh the page or update the UI
        window.location.reload();
      } else {
        alert("❌ Failed to update membership. Please try again.");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("❌ An error occurred while updating membership.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getMembershipStatus = (memberValue) => {
    if (memberValue === 1 || memberValue === true || memberValue === "yes") {
      return (
        <Badge color="success" size="sm">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge color="gray" size="sm">
          Inactive
        </Badge>
      );
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="font-medium w-48 px-4 py-3">
        <Button
          color="link"
          className="p-0 h-auto text-blue-600 hover:text-blue-800 underline"
          onClick={() => updateMembership(props.Name)}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : props.Name}
        </Button>
      </td>

      <td className="text-center w-24 px-4 py-3">
        {getMembershipStatus(props.player.Member)}
      </td>

      <td className="text-center w-32 px-4 py-3">
        <Badge color="blue" size="lg">
          {props.player.Total?.toFixed(2) || "0.00"}
        </Badge>
      </td>

      {Unroll({ player: props.player }, props.barNames)}
    </tr>
  );
};

export default PlayerRow;
