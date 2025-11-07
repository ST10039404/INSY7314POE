import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Gateway from "./components/gateway";
import Login from "./components/login";
import EmployeePortal from "./components/employeePortal/employeePortal";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/gateway" element={<Gateway />} />
        <Route path="/employee" element={<EmployeePortal />} />
      </Routes>
    </div>
  );
};

export default App;