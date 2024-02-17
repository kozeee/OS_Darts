import { Button } from "flowbite-react";
import { useLoaderData } from "react-router-dom";

export default function TournamentPage() {
  const tournament = useLoaderData();
  const tournamentID = tournament._id;

  return (
    <>
      <div className="flex flex-row mt-2 gap-4 justify-evenly">
        <div className="flex flex-col w-1/5 bg-slate-200">
          <p className="text-lg">Options</p>
          <Button
            onClick={() => deleteTournament(tournamentID)}
            className="px-2"
            size="sm"
            pill
            color="failure"
          >
            <a href="/tournaments">Delete Tournament</a>
          </Button>
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex flex-row text-xl font-bold justify-center bg-slate-200 gap-4">
            Tournament Name: {tournament.Name}
          </div>
          <div className="flex flex-col justify-center bg-slate-200">
            <div className="flex flex-row justify-center gap-4 text-lg">
              <p>{tournament.Date}</p>
              <p>{tournament.Bar}</p>
            </div>
            <div className="flex flex-col justify-center gap-4 mt-2 bg-slate-200 text-lg">
              {UnrollWinners(tournament.Winners)}
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
    <p className="justify-center flex">
      {item.Name} - {item.Points} Points
    </p>
  ));
}

async function deleteTournament(id) {
  console.log(id.toString());
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
