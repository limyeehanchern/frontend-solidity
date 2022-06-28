import React, { useState, useEffect } from "react";
import "./App.css";
import Homepage from "./Components/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Homepage />} />
        <Route exact path="/admin/postquestion" element={"postquestion"} />
        <Route exact path="/admin/emergencyrepay" element={"emergencyrepay"} />
        <Route exact path="/admin/reveal" element={"reveal"} />
      </Routes>
    </div>
  );
}

export default App;
