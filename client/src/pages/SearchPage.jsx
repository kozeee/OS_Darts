import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Search from "../components/TournamentSearchBar";

export default function SearchPage() {
  return (
    <div>
      <Search />
    </div>
  );
}
