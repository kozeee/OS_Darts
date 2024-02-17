import { Link } from "react-router-dom";

export default function Lost() {
  return (
    <div className="mt-2 flex flex-row justify-center gap-2">
      <p className="font-bold text-2xl">404 Not Found</p>
      <button className="bg-red-500 text-white font-bold py-1 px-4 rounded">
        <Link to="/">Go back</Link>
      </button>
    </div>
  );
}
