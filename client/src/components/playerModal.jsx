import {
  Button,
  Modal,
  TextInput,
  Checkbox,
  Label,
  Alert,
  Badge,
} from "flowbite-react";
import { useEffect, useState } from "react";

function PlayerModal() {
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setShowSuccess(false);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (payload.Name === "") {
      setError("Please enter a player name");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/Player/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowSuccess(true);
        e.target.reset();
        setTimeout(() => {
          setOpenModal(false);
          setShowSuccess(false);
          // Optionally refresh the page or update the UI
          window.location.reload();
        }, 1500);
      } else {
        setError("Failed to create player. Please try again.");
      }
    } catch (error) {
      console.error("Error creating player:", error);
      setError("An error occurred while creating the player.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError("");
    setShowSuccess(false);
  };

  return (
    <>
      <Button
        color="success"
        size="lg"
        onClick={() => setOpenModal(true)}
        className="px-6 py-2"
      >
        ➕ Add New Player
      </Button>

      <Modal show={openModal} onClose={handleCloseModal} size="md">
        <Modal.Header>
          <div className="flex items-center gap-3">
            <div className="text-2xl">👤</div>
            <span className="text-xl font-bold text-gray-900">
              Add New Player
            </span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            {/* Success Alert */}
            {showSuccess && (
              <Alert color="success">
                <span className="font-medium">✅ Success!</span> Player created
                successfully.
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert color="failure">
                <span className="font-medium">❌ Error!</span> {error}
              </Alert>
            )}

            <form onSubmit={submitForm} className="space-y-6">
              {/* Player Name Input */}
              <div>
                <Label
                  htmlFor="name"
                  className="text-lg font-medium text-gray-700 mb-2"
                >
                  Player Name
                </Label>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter player's full name..."
                  name="Name"
                  required
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the player's full name as it should appear in
                  tournaments.
                </p>
              </div>

              {/* Membership Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox id="member" name="Membership" className="w-5 h-5" />
                <Label
                  htmlFor="member"
                  className="text-lg font-medium text-gray-700"
                >
                  Active Member
                </Label>
                <div className="ml-auto">
                  <Badge color="info" size="sm">
                    Optional
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Check this box if the player is an active member of the darts
                league.
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                color="success"
                size="lg"
                disabled={isSubmitting}
                className="w-full py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Player...
                  </>
                ) : (
                  "👤 Create Player"
                )}
              </Button>
            </form>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button
              color="gray"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PlayerModal;
