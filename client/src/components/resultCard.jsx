const ResultCard = (props) => {
  function UnrollWinners() {
    return props.Winners.map((item, i) => (
      <p>
        {item.Name} - {item.Points} Points
      </p>
    ));
  }
  return (
    <div className="my-2 w-1/4 bg-white p-4 mx-2">
      <a href="/" className="mb-3 text-lg text-black underline">
        {props.Name}
      </a>
      <p>Bar: {props.Bar}</p>
      <p>Game Mode: {props.Mode}</p>
      <p>Date: {props.Date}</p>
      <br />
      <p className="text-lg underline">Winners: </p>
      <UnrollWinners></UnrollWinners>
    </div>
  );
};

export default ResultCard;
