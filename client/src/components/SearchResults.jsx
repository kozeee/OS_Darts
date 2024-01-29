import ResultCard from "./resultCard";

const SearchResults = ({ items }) => {
  console.log(items);
  return items.map(({ Name, Mode, Bar, id, Date }) => {
    return (
      <ResultCard key={id} Name={Name} Mode={Mode} Bar={Bar} Date={Date} />
    );
  });
};

export default SearchResults;
