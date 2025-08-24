import { useState, useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PlayersPage from "./pages/PlayersPage";
import BarsPage from "./pages/BarsPage";
import Lost from "./pages/Lost";
import Tournament from "./pages/Tournament";
import TournamentsPage from "./pages/TournamentsPage";
import { tournamentLoader } from "./pages/Tournament";

// Layout component that includes the Header
function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Lost />,
      children: [
        { index: true, element: <Home /> },
        { path: "tournaments", element: <TournamentsPage /> },
        {
          path: "tournaments/:id",
          element: <Tournament />,
          loader: tournamentLoader,
        },
        { path: "players", element: <PlayersPage /> },
        { path: "bars", element: <BarsPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
