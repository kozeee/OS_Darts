const ResultCard = (props) => {
  console.log(props);
  return (
    <div className="my-2 w-1/4 bg-white p-4 mx-2">
      <a href="/" className="mb-3 text-lg text-black underline">
        {props.Name}
      </a>
      <p>Bar: {props.Bar}</p>
      <p>Game Mode: {props.Mode}</p>
      <p>Date: {props.Date}</p>
    </div>
  );
};

export default ResultCard;
