import ResultCard from "./resultCard";
import { Card } from "flowbite-react";

const SearchResults = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Tournaments Found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or browse all tournaments.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {items.map(({ Name, Mode, Bar, _id, Date, Winners }) => (
        <ResultCard
          key={_id}
          ID={_id}
          Name={Name}
          Mode={Mode}
          Bar={Bar}
          Date={Date}
          Winners={Winners}
        />
      ))}
    </div>
  );
};

export default SearchResults;
