import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Shared/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import VolunteerDashboard from "./components/Dashboard/VolunteerDashboard";
import OrganizationDashboard from "./components/Dashboard/OrganizationDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          {/* Default route goes to Register */}
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/organization" element={<OrganizationDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
