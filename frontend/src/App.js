import React from "react";
import "./App.css";
import Homepage from "./Components/Homepage";
import Admin from "./Components/Admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Homepage />} />
        <Route exact path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
