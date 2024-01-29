import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import PlayerTable from "../components/playerTable";
import PlayerModal from "../components/playerModal";

export default function PlayersPage() {
  return (
    <div>
      <PlayerModal></PlayerModal>
      <PlayerTable></PlayerTable>
    </div>
  );
}
