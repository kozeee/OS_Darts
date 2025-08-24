import { useEffect, useState } from "react";
import { Button, Select, TextInput, Card, Badge } from "flowbite-react";
import BarSelect from "./barSelect";
import SearchResults from "./SearchResults";
import TournamentModal from "./tournamentModal";

export default function Search() {
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    fetchData({ Name: "", Bar: "", Mode: "" });
  }, []);

  const fetchData = async (value) => {
    setIsSearching(true);
    try {
      let payload;
      if (value.Name !== "" || value.Bar !== "" || value.Mode !== "") {
        payload = { conditionCount: 1, query: value };
      } else {
        payload = { conditionCount: 0, query: {} };
      }

      const response = await fetch("/api/Tournament/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();
      setItems(resJson);
      setSearchCount(resJson.length);
    } catch (error) {
      console.error("Error searching tournaments:", error);
      alert("❌ An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    fetchData(payload);
  };

  const clearSearch = () => {
    const form = document.getElementById("searchForm");
    form.reset();
    fetchData({ Name: "", Bar: "", Mode: "" });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🔍 Search Tournaments
          </h3>
          <TournamentModal />
        </div>

        <form id="searchForm" onSubmit={submitForm} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Name
              </label>
              <TextInput
                id="name"
                type="text"
                placeholder="Enter tournament name..."
                name="Name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Mode
              </label>
              <Select name="Mode" id="gameType" className="w-full">
                <option value="">Any Mode</option>
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bar Location
              </label>
              <BarSelect />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              color="blue"
              disabled={isSearching}
              className="flex-1"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                "🔍 Search Tournaments"
              )}
            </Button>

            <Button
              type="button"
              color="gray"
              outline
              onClick={clearSearch}
              className="px-6"
            >
              🗑️ Clear
            </Button>
          </div>
        </form>
      </div>

      {/* Search Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results
          </h3>
          {searchCount > 0 && (
            <Badge color="info" size="sm">
              {searchCount} tournament{searchCount !== 1 ? "s" : ""} found
            </Badge>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SearchResults items={items} />
      </div>
    </div>
  );
}
