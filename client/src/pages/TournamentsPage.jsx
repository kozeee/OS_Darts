import { useState, useEffect } from "react";
import { Button, Card, Badge, Select, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import TournamentModal from "../components/tournamentModal";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [bars, setBars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [filterBar, setFilterBar] = useState("");

  useEffect(() => {
    fetchTournaments();
    fetchBars();
  }, []);

  useEffect(() => {
    filterTournaments();
  }, [tournaments, searchTerm, filterMode, filterBar]);

  const fetchTournaments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/Tournament/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conditionCount: 0, query: {} }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }

      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setError("Failed to load tournaments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBars = async () => {
    try {
      const response = await fetch("/api/Bar/all");
      if (!response.ok) {
        throw new Error("Failed to fetch bars");
      }
      const data = await response.json();
      setBars(data);
    } catch (error) {
      console.error("Error fetching bars:", error);
    }
  };

  const filterTournaments = () => {
    let filtered = [...tournaments];

    // Search by tournament name
    if (searchTerm) {
      filtered = filtered.filter((tournament) =>
        tournament.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by game mode
    if (filterMode) {
      filtered = filtered.filter(
        (tournament) => tournament.Mode === filterMode
      );
    }

    // Filter by bar
    if (filterBar) {
      filtered = filtered.filter((tournament) => tournament.Bar === filterBar);
    }

    setFilteredTournaments(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterMode("");
    setFilterBar("");
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getUniqueBars = () => {
    return bars.map((bar) => bar.Name).sort();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tournaments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Tournaments
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button color="blue" onClick={fetchTournaments}>
              🔄 Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🏆 Tournaments
              </h1>
              <p className="text-lg text-gray-600">
                View and manage all darts tournaments. Create new tournaments or
                browse existing ones.
              </p>
            </div>
            <div className="flex gap-3">
              <TournamentModal />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Search Tournaments
                </label>
                <TextInput
                  type="text"
                  placeholder="Tournament name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Game Mode
                </label>
                <Select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Modes</option>
                  <option value="singles">Singles</option>
                  <option value="doubles">Doubles</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏪 Bar Location
                </label>
                <Select
                  value={filterBar}
                  onChange={(e) => setFilterBar(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Bars</option>
                  {getUniqueBars().map((bar) => (
                    <option key={bar} value={bar}>
                      {bar}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  color="gray"
                  outline
                  onClick={clearFilters}
                  className="w-full"
                >
                  🗑️ Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tournaments List */}
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Tournament Results
              </h2>
              {filteredTournaments.length > 0 && (
                <Badge color="info" size="lg">
                  {filteredTournaments.length} tournament
                  {filteredTournaments.length !== 1 ? "s" : ""} found
                </Badge>
              )}
            </div>

            <Button color="gray" size="sm" outline onClick={fetchTournaments}>
              🔄 Refresh
            </Button>
          </div>

          {/* Tournaments Grid */}
          {filteredTournaments.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Tournaments Found
              </h3>
              <p className="text-gray-600 mb-4">
                {tournaments.length === 0
                  ? "There are no tournaments yet. Create your first tournament!"
                  : "Try adjusting your search criteria or filters."}
              </p>
              {tournaments.length === 0 && <TournamentModal />}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <Card
                  key={tournament._id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Tournament Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/tournaments/${tournament._id}`}
                          className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-2 block"
                        >
                          🏆 {tournament.Name}
                        </Link>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🏪</span>
                            <span className="text-gray-700">
                              {tournament.Bar}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🎯</span>
                            <Badge
                              color={
                                tournament.Mode === "singles" ? "blue" : "green"
                              }
                              size="sm"
                            >
                              {tournament.Mode}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">📅</span>
                            <span className="text-gray-700">
                              {formatDate(tournament.Date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tournament Results */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        🏅 Results
                      </h4>
                      {tournament.Winners && tournament.Winners.length > 0 ? (
                        <div className="space-y-1">
                          {tournament.Winners.slice(0, 3).map((winner, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="font-medium text-gray-900">
                                {i === 0 && "🥇"}
                                {i === 1 && "🥈"}
                                {i === 2 && "🥉"}
                                {i > 2 && "🏅"} {winner.Name}
                              </span>
                              <Badge color="purple" size="sm">
                                {winner.Points} pts
                              </Badge>
                            </div>
                          ))}
                          {tournament.Winners.length > 3 && (
                            <div className="text-xs text-gray-500 italic">
                              +{tournament.Winners.length - 3} more participants
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic">
                          No results recorded
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        to={`/tournaments/${tournament._id}`}
                        className="w-full"
                      >
                        <Button
                          color="blue"
                          size="sm"
                          outline
                          className="w-full"
                        >
                          View Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
