import {
  Button,
  Select,
  Card,
  Badge,
  Modal,
  TextInput,
  Label,
} from "flowbite-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TournamentPage() {
  const initialTournament = useLoaderData();
  const [tournament, setTournament] = useState(initialTournament);
  const tournamentID = tournament._id;
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingPlayer, setRemovingPlayer] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [newPlayerPoints, setNewPlayerPoints] = useState("");
  const [players, setPlayers] = useState([]);
  const [playersError, setPlayersError] = useState(null);

  // Helper function to convert MM/DD/YYYY to YYYY-MM-DD for HTML date input
  const convertDateForInput = (dateString) => {
    if (!dateString) return "";

    console.log(`convertDateForInput - input: ${dateString}`);

    // If the date is already in YYYY-MM-DD format, return as is
    if (dateString.includes("-")) {
      console.log(`Date already in YYYY-MM-DD format: ${dateString}`);
      return dateString;
    }

    // Convert from MM/DD/YYYY to YYYY-MM-DD
    // Parse MM/DD/YYYY manually to avoid timezone issues
    const parts = dateString.split("/");
    if (parts.length !== 3) {
      console.log(`Invalid date format: ${dateString}`);
      return "";
    }

    const month = parseInt(parts[0]) - 1; // Month is 0-indexed
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    // Create date in local timezone to avoid UTC conversion issues
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
      console.log(`Invalid date: ${dateString}`);
      return ""; // Invalid date, return empty string
    }

    // Format as YYYY-MM-DD manually to avoid timezone issues
    const result = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    console.log(`convertDateForInput - converted: ${dateString} -> ${result}`);
    return result;
  };

  // Helper function to format MM/DD/YYYY for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";

    console.log(`formatDateForDisplay - input: ${dateString}`);

    // If the date is already in MM/DD/YYYY format, format it nicely
    if (dateString.includes("/")) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0]);
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          const result = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          console.log(
            `formatDateForDisplay - formatted: ${dateString} -> ${result}`
          );
          return result;
        }
      }
    }

    // If it's in YYYY-MM-DD format, convert it first
    if (dateString.includes("-")) {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);

        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          const result = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          console.log(
            `formatDateForDisplay - formatted: ${dateString} -> ${result}`
          );
          return result;
        }
      }
    }

    console.log(`formatDateForDisplay - fallback: ${dateString}`);
    return dateString;
  };

  // Update local state when loader data changes
  useEffect(() => {
    console.log("Tournament data loaded:", initialTournament);
    console.log("Tournament date:", initialTournament.Date);
    setTournament(initialTournament);
  }, [initialTournament]);

  // Fetch players for the dropdown
  useEffect(() => {
    fetch("/api/Player/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tournament players data:", data);
        setPlayers(data);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setPlayersError(error.message);
      });
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteTournament(tournamentID);
      setShowDeleteModal(false);
      navigate("/tournaments");
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  const removePlayer = async (playerIndex) => {
    if (!confirm("Are you sure you want to remove this player?")) {
      return;
    }

    setRemovingPlayer(playerIndex);

    try {
      const response = await fetch("/api/Tournament/removePlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId: tournamentID,
          playerIndex: playerIndex,
        }),
      });

      if (response.ok) {
        // Update local state to remove the player
        const updatedWinners = [...tournament.Winners];
        updatedWinners.splice(playerIndex, 1);

        setTournament({
          ...tournament,
          Winners: updatedWinners,
        });

        alert("✅ Player removed successfully!");
      } else {
        alert("❌ Failed to remove player. Please try again.");
      }
    } catch (error) {
      console.error("Error removing player:", error);
      alert("❌ An error occurred while removing the player.");
    } finally {
      setRemovingPlayer(null);
    }
  };

  const addPlayer = async (e) => {
    e.preventDefault();

    if (!selectedPlayerId || !newPlayerPoints.trim()) {
      alert("Please select a player and enter points");
      return;
    }

    // Basic duplicate check - we'll let the backend do the full validation
    // since we need to check against player names, not just IDs
    setAddingPlayer(true);

    try {
      const response = await fetch("/api/Tournament/addPlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId: tournamentID,
          playerId: selectedPlayerId,
          playerPoints: parseFloat(newPlayerPoints),
        }),
      });

      if (response.ok) {
        const updatedTournament = await response.json();

        // Update local state with the new player
        setTournament(updatedTournament);

        // Reset form and close modal
        setSelectedPlayerId("");
        setNewPlayerPoints("");
        setShowAddPlayerModal(false);

        alert("✅ Player added successfully!");
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          alert(`❌ ${errorData.error}`);
        } else {
          alert("❌ Failed to add player. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding player:", error);
      alert("❌ An error occurred while adding the player.");
    } finally {
      setAddingPlayer(false);
    }
  };

  const handleCloseAddPlayerModal = () => {
    setShowAddPlayerModal(false);
    setSelectedPlayerId("");
    setNewPlayerPoints("");
    setAddingPlayer(false);
  };

  const getPlayerOptions = () => {
    if (playersError) {
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
          <option key={item._id} value={item._id}>
            {item.FullName || item.Name}
          </option>
        );
      })
      .filter(Boolean);
  };

  const UnrollWinners = (winners, onRemovePlayer, removingPlayer) => {
    return winners.map((item, i) => (
      <Card key={i} className="relative">
        <div className="absolute -top-3 -left-3">
          <Badge color="purple" size="sm">
            #{i + 1}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Name
            </label>
            <Select name={`f${i}`} defaultValue={item.Name} className="w-full">
              <option value={item.Name}>{item.Name}</option>
              {getPlayerOptions()}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position/Points
            </label>
            <input
              type="number"
              step="0.01"
              name={`p${i}`}
              defaultValue={item.Points}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter position or points"
            />
          </div>

          <Button
            color="failure"
            size="sm"
            onClick={() => onRemovePlayer(i)}
            disabled={removingPlayer === i}
            className="w-full"
          >
            {removingPlayer === i ? "Removing..." : "🚫 Remove Player"}
          </Button>
        </div>
      </Card>
    ));
  };

  const submitForm = async (e, setIsSubmitting) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData);

      const response = await fetch("/api/Tournament/edit/" + payload.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Tournament updated successfully!");
        window.location.reload();
      } else {
        alert("❌ Failed to update tournament. Please try again.");
      }
    } catch (error) {
      console.error("Error updating tournament:", error);
      alert("❌ An error occurred while updating the tournament.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTournament = async (id) => {
    try {
      const url = "/api/Tournament/delete/" + id;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error("Failed to delete tournament");
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
      return false;
    }
  };

  const editDate = async (tournamentId, setIsUpdatingDate, setIsEditing) => {
    const dateInput = document.getElementById("dateInput");
    const newDate = dateInput.value;

    if (!newDate) {
      alert("Please select a valid date");
      return;
    }

    // Parse the date to ensure it's handled as local date without timezone issues
    const [year, month, day] = newDate.split("-").map(Number);
    const localDate = new Date(year, month - 1, day); // month is 0-indexed

    // Format as MM/DD/YYYY to match database format
    const formattedDate = `${month}/${day}/${year}`;

    console.log(`editDate - input: ${newDate}, formatted: ${formattedDate}`);

    setIsUpdatingDate(true);

    try {
      const response = await fetch("/api/Tournament/editDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: tournamentId,
          date: formattedDate,
        }),
      });

      if (response.ok) {
        alert("✅ Date updated successfully!");
        setIsEditing(false);
        window.location.reload();
      } else {
        alert("❌ Failed to update date. Please try again.");
      }
    } catch (error) {
      console.error("Error updating date:", error);
      alert("❌ An error occurred while updating the date.");
    } finally {
      setIsUpdatingDate(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {tournament.Name}
            </h1>
            <Button
              color="gray"
              size="sm"
              onClick={() => navigate("/tournaments")}
            >
              ← Back to Tournaments
            </Button>
          </div>

          {/* Tournament Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">📅 Date</div>
              <div className="text-lg text-gray-700 mb-3">
                {formatDateForDisplay(tournament.Date)}
              </div>
              {!isEditing && (
                <Button
                  color="info"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Date
                </Button>
              )}
              {isEditing && (
                <div className="space-y-3">
                  <input
                    type="date"
                    id="dateInput"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={convertDateForInput(tournament.Date)}
                  />
                  <div className="flex gap-2">
                    <Button
                      color="success"
                      size="sm"
                      onClick={() =>
                        editDate(tournamentID, setIsUpdatingDate, setIsEditing)
                      }
                      disabled={isUpdatingDate}
                    >
                      {isUpdatingDate ? "Updating..." : "Save"}
                    </Button>
                    <Button
                      color="gray"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">🏪 Bar</div>
              <div className="text-lg text-gray-700">{tournament.Bar}</div>
            </Card>

            <Card className="text-center">
              <div className="text-2xl font-bold text-purple-600">🎯 Mode</div>
              <div className="text-lg text-gray-700">{tournament.Mode}</div>
            </Card>
          </div>
        </div>

        {/* Winners Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🏆 Tournament Winners
            </h2>
            <div className="flex items-center gap-3">
              <Badge color="info" size="lg">
                {tournament.Winners.length} Participants
              </Badge>
              <Button
                color="success"
                size="sm"
                onClick={() => setShowAddPlayerModal(true)}
              >
                ➕ Add Player
              </Button>
            </div>
          </div>

          <form
            onSubmit={(e) => submitForm(e, setIsSubmitting)}
            className="space-y-6"
          >
            <input type="hidden" value={tournamentID} name="id" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UnrollWinners(tournament.Winners, removePlayer, removingPlayer)}
            </div>

            <div className="flex justify-center gap-4 pt-6 border-t">
              <Button
                color="success"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? "Saving Changes..." : "💾 Save Changes"}
              </Button>

              <Button
                color="failure"
                size="lg"
                onClick={() => setShowDeleteModal(true)}
                className="px-8"
              >
                🗑️ Delete Tournament
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Player Modal */}
      <Modal
        show={showAddPlayerModal}
        onClose={handleCloseAddPlayerModal}
        size="md"
      >
        <Modal.Header>
          <div className="flex items-center gap-3">
            <div className="text-2xl">👤</div>
            <span className="text-xl font-bold text-gray-900">
              Add New Player
            </span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={addPlayer} className="space-y-4">
            <div>
              <Label
                htmlFor="playerSelect"
                className="text-lg font-medium text-gray-700 mb-2"
              >
                Select Player
              </Label>
              <Select
                id="playerSelect"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                required
                className="w-full"
              >
                <option value="">Choose a player...</option>
                {getPlayerOptions()}
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Select a player from the existing player list
              </p>
            </div>

            <div>
              <Label
                htmlFor="playerPoints"
                className="text-lg font-medium text-gray-700 mb-2"
              >
                Points/Position
              </Label>
              <TextInput
                id="playerPoints"
                type="number"
                step="0.01"
                placeholder="Enter points or position..."
                value={newPlayerPoints}
                onChange={(e) => setNewPlayerPoints(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                color="success"
                size="lg"
                disabled={addingPlayer}
                className="flex-1"
              >
                {addingPlayer ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Player...
                  </>
                ) : (
                  "👤 Add Player"
                )}
              </Button>

              <Button
                type="button"
                color="gray"
                onClick={handleCloseAddPlayerModal}
                disabled={addingPlayer}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <Modal.Header>
          <span className="text-xl font-bold text-red-600">
            Confirm Deletion
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              Are you sure you want to delete the tournament
              <span className="font-bold text-gray-900">
                {" "}
                "{tournament.Name}"
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All tournament data will be
              permanently removed.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="failure" onClick={handleDeleteConfirm}>
              Delete Tournament
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export const tournamentLoader = async ({ params }) => {
  const url = "/api/Tournament/view/" + params.id;
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(url, data);
  return res;
};
