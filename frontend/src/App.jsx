import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Traffic from "./components/Traffic";
import AirQuality from "./components/AirQuality";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/traffic/" element={<Traffic />} />
        <Route path="/airquality/" element={<AirQuality />} />
      </Routes>
    </div>
  );
}

export default App;
