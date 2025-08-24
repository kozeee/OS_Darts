import { BrowserRouter, Routes, Route, Form } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  TextInput,
  Checkbox,
  Label,
  Card,
  Badge,
  Alert,
} from "flowbite-react";

export default function BarsPage() {
  const [items, setItems] = useState("");
  const [bars, setBars] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Debug: Log bars state changes
  useEffect(() => {
    console.log("Bars state changed:", bars);
    console.log("Bars length:", bars.length);
  }, [bars]);

  // Fetch existing bars on component mount
  useEffect(() => {
    fetchBars();
  }, []);

  const fetchBars = async () => {
    try {
      console.log("Fetching bars from /api/Bar/all...");
      const response = await fetch("/api/Bar/all");
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error("Failed to fetch bars");
      }

      const data = await response.json();
      console.log("Bars data received:", data);
      console.log("Bars data type:", typeof data);
      console.log(
        "Bars data length:",
        Array.isArray(data) ? data.length : "Not an array"
      );

      setBars(data);
    } catch (error) {
      console.error("Error fetching bars:", error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (payload.Name === "") {
      alert("Please enter a bar name");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/Bar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowSuccess(true);
        e.target.reset();
        fetchBars(); // Refresh the bars list
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Failed to add bar. Please try again.");
      }
    } catch (error) {
      console.error("Error adding bar:", error);
      alert("An error occurred while adding the bar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏪 Bar Management
          </h1>
          <p className="text-lg text-gray-600">
            Add new bars and manage existing bar locations for tournaments.
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert color="success" className="mb-6">
            <span className="font-medium">✅ Success!</span> Bar added
            successfully.
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Bar Form */}
          <Card className="shadow-lg">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">➕</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Add New Bar
                </h2>
                <p className="text-gray-600">
                  Enter the name of a new bar to add it to the system.
                </p>
              </div>

              <form onSubmit={submitForm} className="space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    Bar Name
                  </Label>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Enter bar name..."
                    name="Name"
                    required
                    className="w-full"
                  />
                </div>

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
                      Adding Bar...
                    </>
                  ) : (
                    "🏪 Add New Bar"
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Existing Bars List */}
          <Card className="shadow-lg">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🏪</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Existing Bars
                </h2>
                <p className="text-gray-600">
                  All bars currently registered in the system.
                </p>
              </div>

              <div className="space-y-3">
                {/* Debug info */}
                <div className="text-xs text-gray-400 mb-2">
                  Debug: bars.length = {bars.length}, bars ={" "}
                  {JSON.stringify(bars)}
                </div>

                {bars.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">📝</div>
                    <p>No bars found. Add your first bar using the form!</p>
                  </div>
                ) : (
                  bars.map((bar, index) => (
                    <div
                      key={bar._id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge color="blue" size="sm">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium text-gray-900">
                          {bar.Name}
                        </span>
                      </div>
                      <Badge color="success" size="sm">
                        Active
                      </Badge>
                    </div>
                  ))
                )}
              </div>

              {bars.length > 0 && (
                <div className="mt-4 text-center">
                  <Badge color="info" size="lg">
                    Total Bars: {bars.length}
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
