import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PlayersPage from "./pages/PlayersPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/tournaments" element={<SearchPage />}></Route>
            <Route path="/players" element={<PlayersPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
