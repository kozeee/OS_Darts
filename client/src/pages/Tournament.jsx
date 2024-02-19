import { Button, Select } from "flowbite-react";
import { useLoaderData } from "react-router-dom";
import PlayerSelect from "../components/PlayerSelect";

export default function TournamentPage() {
  const tournament = useLoaderData();
  const tournamentID = tournament._id;

  return (
    <>
      <div className="flex flex-row mt-2 gap-4 justify-evenly bg-slate-200 py-2">
        <div className="flex flex-col w-1/2">
          <div className="flex flex-row text-xl font-bold justify-center bg-slate-200 gap-4">
            Tournament Name: {tournament.Name}
          </div>
          <div className="flex flex-col justify-center bg-slate-200">
            <div className="flex flex-row justify-center gap-4 text-lg">
              <p>{tournament.Date}</p>
              <p>{tournament.Bar}</p>
            </div>
            <div className="flex flex-col justify-center gap-4 bg-slate-200 text-lg">
              <form
                onSubmit={submitForm}
                className="flex flex-row justify-center bg-slate-200 gap-2"
              >
                <input
                  type="text"
                  className="invisible"
                  readOnly
                  value={tournamentID}
                  name="id"
                ></input>
                {UnrollWinners(tournament.Winners)}
                <Button
                  color="success"
                  className="px-2"
                  size="sm"
                  pill
                  type="submit"
                >
                  Submit Edits
                </Button>
                <Button
                  onClick={() => deleteTournament(tournamentID)}
                  className="px-2"
                  size="sm"
                  pill
                  color="failure"
                >
                  <a href="/tournaments">Delete Tournament</a>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const tournamentLoader = async ({ params }) => {
  const url = "/api/tournament/view/" + params.id;
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(url, data);
  return res;
};

function UnrollWinners(winners) {
  return winners.map((item, i) => (
    <div key={i} id={"player" + i} className="flex flex-col gap-2">
      <Select type="select" name={"f" + i} selected={item.Name}>
        <option selected value={item.Name}>
          {item.Name}
        </option>
        <PlayerSelect></PlayerSelect>
      </Select>
      <input type="number" name={"p" + i} defaultValue={item.Points}></input>
      <Button
        color="failure"
        onClick={() => {
          removeWinner("player" + i);
        }}
      >
        Remove Player
      </Button>
    </div>
  ));
}

const submitForm = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData);

  fetch("/api/tournament/edit/" + payload.id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const removeWinner = (player) => {
  const element = document.getElementById(player);
  element.remove();
};

async function deleteTournament(id) {
  const url = "/api/tournament/delete/" + id;
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(url, data);
  return;
}
