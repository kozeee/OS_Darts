import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Card,
  Badge,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import Players from "./Players";
import useBarList from "./barList";

const PlayerTable = ({ dateRange }) => {
  const [report, setReport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const bars = useBarList();

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (dateRange && dateRange.startDate && dateRange.endDate) {
        // Use date range endpoint
        response = await fetch("/api/Player/dateRange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        });
      } else {
        // Use default all points endpoint
        response = await fetch("/api/Points/all");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const data = await response.json();
      console.log("Points data:", data);
      setReport(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      setError("Failed to load player data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const getBars = () => {
    console.log("Bars data:", bars);
    console.log("Bars length:", bars.length);
    const barHeaders = bars.map((item, i) => {
      console.log(`Bar ${i}:`, item);
      return (
        <th
          key={i}
          className="text-center font-semibold text-gray-700 w-24 px-4 py-3"
        >
          🏪 {item.Name}
        </th>
      );
    });
    console.log("Generated bar headers:", barHeaders.length);
    return barHeaders;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading player data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Data
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button color="blue" onClick={refreshData}>
          🔄 Try Again
        </Button>
      </div>
    );
  }

  if (!report || report.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {dateRange ? "No Players Found for Date Range" : "No Players Found"}
        </h3>
        <p className="text-gray-600">
          {dateRange
            ? "No players had tournament activity during the selected date range. Try adjusting your dates or check if tournaments were held during this period."
            : "There are no players registered in the system yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge color="info" size="lg">
            {report.length} Player{report.length !== 1 ? "s" : ""}
          </Badge>
          {dateRange && (
            <Badge color="purple" size="sm">
              📅 Date Filtered
            </Badge>
          )}
        </div>
        <Button color="gray" size="sm" outline onClick={refreshData}>
          🔄 Refresh
        </Button>
      </div>

      {/* Players Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-semibold text-gray-900 w-48 px-4 py-3 text-left">
                👤 PLAYER
              </th>
              <th className="font-semibold text-gray-900 w-24 text-center px-4 py-3">
                🏆 MEMBER
              </th>
              <th className="font-semibold text-gray-900 text-center w-32 px-4 py-3">
                📊 TOTAL POINTS
              </th>
              {getBars()}
            </tr>
          </thead>
          <tbody>
            <Players items={report} barNames={bars.map((bar) => bar.Name)} />
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>
          💡 Click on a player row to view detailed information and edit player
          data.
        </p>
      </div>
    </div>
  );
};

export default PlayerTable;
