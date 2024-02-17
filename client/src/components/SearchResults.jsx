import ResultCard from "./resultCard";

const SearchResults = ({ items }) => {
  return items.map(({ Name, Mode, Bar, _id, Date, Winners }) => {
    return (
      <ResultCard
        key={_id}
        ID={_id}
        Name={Name}
        Mode={Mode}
        Bar={Bar}
        Date={Date}
        Winners={Winners}
      />
    );
  });
};

export default SearchResults;
