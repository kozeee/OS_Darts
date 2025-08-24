import { Badge, Button } from "flowbite-react";
import { Link } from "react-router-dom";

const ResultCard = (props) => {
  function UnrollWinners() {
    if (!props.Winners || props.Winners.length === 0) {
      return (
        <div className="text-gray-500 text-sm italic">No winners recorded</div>
      );
    }

    return (
      <div className="space-y-1">
        {props.Winners.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">
              {i === 0 && "🥇"}
              {i === 1 && "🥈"}
              {i === 2 && "🥉"}
              {i > 2 && "🏅"} {item.Name}
            </span>
            <Badge color="purple" size="sm">
              {item.Points} pts
            </Badge>
          </div>
        ))}
        {props.Winners.length > 3 && (
          <div className="text-xs text-gray-500 italic">
            +{props.Winners.length - 3} more participants
          </div>
        )}
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/tournaments/${props.ID}`}
            className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-2 block"
          >
            🏆 {props.Name}
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">🏪</span>
              <span className="text-gray-700">{props.Bar}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500">🎯</span>
              <Badge
                color={props.Mode === "singles" ? "blue" : "green"}
                size="sm"
              >
                {props.Mode}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500">📅</span>
              <span className="text-gray-700">{formatDate(props.Date)}</span>
            </div>
          </div>
        </div>

        <Link to={`/tournaments/${props.ID}`}>
          <Button color="blue" size="sm" outline>
            View Details →
          </Button>
        </Link>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          🏅 Tournament Results
        </h4>
        <UnrollWinners />
      </div>
    </div>
  );
};

export default ResultCard;
