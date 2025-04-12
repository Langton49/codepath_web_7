import React from "react";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import ArtistDetails from "./components/Detail"
import "./App.css";
import AboutPage from "./pages/About";

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/*" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default App;