import { useEffect, useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import BarSelect from "./barSelect";
import SearchResults from "./SearchResults";
import TournamentModal from "./tournamentModal";

export default function Search() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData({ Name: "", Bar: "", Mode: "" });
  }, []);

  const fetchData = (value) => {
    if (value.Name !== "" || value.Bar !== "" || value.Mode !== "") {
      fetch("/api/tournament/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conditionCount: 1, query: value }),
      })
        .then((response) => response.json())
        .then((resJson) => setItems(resJson));
    } else {
      fetch("/api/tournament/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conditionCount: 0, query: {} }),
      })
        .then((response) => response.json())
        .then((resJson) => setItems(resJson));
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    fetchData(payload);
  };

  return (
    <div>
      <div className="flex justify-center">
        <TournamentModal></TournamentModal>
        <form
          onSubmit={submitForm}
          className="flex max-w-lg flex-row gap-4 mt-2"
        >
          <TextInput
            id="name"
            type="text"
            placeholder="tournament name"
            name="Name"
          ></TextInput>
          <Select name="Mode" id="gameType">
            <option value="">Any</option>
            <option value="singles">Singles</option>
            <option value="doubles">Doubles</option>
          </Select>
          <BarSelect />
          <Button type="Submit"> Search </Button>
        </form>
      </div>
      <div className="flex flex-wrap justify-center my-4 items-center bg-slate-500">
        <SearchResults className="" items={items} />
      </div>
    </div>
  );
}
