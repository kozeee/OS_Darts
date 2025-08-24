import { useState } from "react";
import { Label, Datepicker, Button, Card, Badge } from "flowbite-react";

export default function Home() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      let setstartDate = new Date(startDate.toDateString());
      let setendDate = new Date(endDate.toDateString());
      const url = "/api/points/dateRange";
      let payload = {
        startDate: setstartDate.toISOString().split("T")[0],
        endDate: setendDate.toISOString().split("T")[0],
      };

      const data = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      const res = await fetch(url, data);

      // Check if the response is successful
      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText);
      } else {
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `points-report-${payload.startDate}-to-${payload.endDate}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        alert("✅ Points report generated successfully!");
      }
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-5xl font-bold mb-6">Welcome to VaDarts</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your comprehensive darts tournament management system. Track
              players, manage tournaments, and generate detailed reports all in
              one place.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What You Can Do
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Manage Tournaments
            </h3>
            <p className="text-gray-600">
              Create, edit, and track darts tournaments with detailed player
              results and standings.
            </p>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Player Management
            </h3>
            <p className="text-gray-600">
              Keep track of all players, their statistics, and tournament
              participation history.
            </p>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Generate Reports
            </h3>
            <p className="text-gray-600">
              Export detailed points reports and analytics for any date range
              you specify.
            </p>
          </Card>
        </div>
      </div>

      {/* Points Report Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Card className="shadow-xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Generate Points Report
            </h2>
            <p className="text-gray-600">
              Select a date range to generate a comprehensive points report for
              all tournaments.
            </p>
          </div>

          <form onSubmit={submitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="datepicker-range-start"
                  className="text-lg font-medium text-gray-700 mb-2"
                >
                  📅 Start Date
                </Label>
                <Datepicker
                  id="datepicker-range-start"
                  title="Start Date"
                  onSelectedDateChanged={handleStartDateChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="datepicker-range-end"
                  className="text-lg font-medium text-gray-700 mb-2"
                >
                  📅 End Date
                </Label>
                <Datepicker
                  id="datepicker-range-end"
                  title="End Date"
                  onSelectedDateChanged={handleEndDateChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                type="submit"
                size="lg"
                color="blue"
                disabled={isGenerating}
                className="px-8 py-3"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Report...
                  </>
                ) : (
                  "🚀 Generate Points Report"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
