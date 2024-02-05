import ResultCard from "./resultCard";

const SearchResults = ({ items }) => {
  return items.map(({ Name, Mode, Bar, _id, Date }) => {
    return (
      <ResultCard key={_id} Name={Name} Mode={Mode} Bar={Bar} Date={Date} />
    );
  });
};

export default SearchResults;
