import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import PlayerTable from "../components/PlayerTable";
import PlayerModal from "../components/playerModal";
import DateRangeFilter from "../components/DateRangeFilter";
import { Button, Card } from "flowbite-react";

export default function PlayersPage() {
  const [dateRange, setDateRange] = useState(null);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleDateRangeReset = () => {
    setDateRange(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                👥 Player Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage all players, view statistics, and track tournament
                participation. Filter by date range to see specific time
                periods.
              </p>
            </div>
            <div className="flex gap-3">
              <PlayerModal />
            </div>
          </div>
        </div>

        {/* Date Range Filter Section */}
        <div className="mb-6">
          <DateRangeFilter
            onDateRangeChange={handleDateRangeChange}
            onReset={handleDateRangeReset}
          />
        </div>

        {/* Players Table Section */}
        <Card className="shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Players</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Click on a player to view details or edit information
                </span>
              </div>
            </div>
            <PlayerTable dateRange={dateRange} />
          </div>
        </Card>
      </div>
    </div>
  );
}
