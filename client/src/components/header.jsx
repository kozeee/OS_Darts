import { Navbar, Button } from "flowbite-react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar
      className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
      fluid
    >
      <Navbar.Brand href="/" className="text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">🎯</span>
          </div>
          <span className="text-xl font-bold text-white">VaDarts</span>
        </div>
      </Navbar.Brand>

      <Navbar.Collapse className="space-x-1">
        <Navbar.Link
          href="/"
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/")
              ? "bg-white text-blue-600 font-semibold shadow-md"
              : "text-white hover:bg-white/20 hover:text-white"
          }`}
        >
          🏠 Home
        </Navbar.Link>

        <Navbar.Link
          href="/tournaments"
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/tournaments")
              ? "bg-white text-blue-600 font-semibold shadow-md"
              : "text-white hover:bg-white/20 hover:text-white"
          }`}
        >
          🏆 Tournaments
        </Navbar.Link>

        <Navbar.Link
          href="/players"
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/players")
              ? "bg-white text-blue-600 font-semibold shadow-md"
              : "text-white hover:bg-white/20 hover:text-white"
          }`}
        >
          👥 Players
        </Navbar.Link>

        <Navbar.Link
          href="/bars"
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/bars")
              ? "bg-white text-blue-600 font-semibold shadow-md"
              : "text-white hover:bg-white/20 hover:text-white"
          }`}
        >
          🏪 Bars
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
