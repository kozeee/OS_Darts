import {
  Button,
  Modal,
  TextInput,
  Checkbox,
  Label,
  Select,
  Alert,
  Badge,
} from "flowbite-react";
import { useEffect, useState } from "react";
import BarSelect from "./barSelect";
import FormWithPlayerSelects from "./PlayerSelectAmount";
import { Form } from "react-router-dom";

function TournamentModal() {
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
      setError("Please enter a tournament name");
      setIsSubmitting(false);
      return;
    }

    if (payload.Participants === "" || isNaN(payload.Participants)) {
      setError("Please enter a valid number of participants");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/Tournament/create", {
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
        setError("Failed to create tournament. Please try again.");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      setError("An error occurred while creating the tournament.");
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
        🏆 Create Tournament
      </Button>

      <Modal show={openModal} onClose={handleCloseModal} size="4xl">
        <Modal.Header>
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <span className="text-xl font-bold text-gray-900">
              Create New Tournament
            </span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            {/* Success Alert */}
            {showSuccess && (
              <Alert color="success">
                <span className="font-medium">✅ Success!</span> Tournament
                created successfully.
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert color="failure">
                <span className="font-medium">❌ Error!</span> {error}
              </Alert>
            )}

            <form onSubmit={submitForm} className="space-y-6">
              {/* Basic Tournament Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    Tournament Name
                  </Label>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Enter tournament name..."
                    name="Name"
                    required
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Give your tournament a descriptive name.
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="location"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    🏪 Bar Location
                  </Label>
                  <BarSelect />
                  <p className="text-sm text-gray-500 mt-1">
                    Select the bar where the tournament will be held.
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="gameType"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    🎯 Game Mode
                  </Label>
                  <Select name="Mode" id="gameType" className="w-full">
                    <option value="singles">Singles</option>
                    <option value="doubles">Doubles</option>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose between singles or doubles format.
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="participants"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    👥 Number of Participants
                  </Label>
                  <TextInput
                    id="participants"
                    type="number"
                    placeholder="Enter number of players..."
                    name="Participants"
                    required
                    min="1"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Total number of players in the tournament.
                  </p>
                </div>
              </div>

              {/* Player Selection Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    🏅 Tournament Results
                  </h3>
                  <Badge color="info" size="sm">
                    Required
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select the winners and their positions to calculate points.
                </p>
                <FormWithPlayerSelects fieldPrefix="w" />
              </div>

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
                    Creating Tournament...
                  </>
                ) : (
                  "🏆 Create Tournament"
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

export default TournamentModal;
