import { useState, useEffect } from "react";
import { Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PlayersPage from "./pages/PlayersPage";
import BarsPage from "./pages/BarsPage";
import Lost from "./pages/Lost";
import Tournament from "./pages/Tournament";
import { tournamentLoader } from "./pages/Tournament";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Lost />,
    },
    { path: "tournaments", element: <SearchPage /> },
    {
      path: "tournaments/:id",
      element: <Tournament />,
      loader: tournamentLoader,
    },
    { path: "players", element: <PlayersPage /> },
    { path: "bars", element: <BarsPage /> },
  ]);

  return (
    <>
      <Header />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
