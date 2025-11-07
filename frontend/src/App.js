import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Gateway from "./components/gateway";
import Register from "./components/employeePortal/employeeRegister";
import Login from "./components/login";
import EmployeePortal from "./components/employeePortal/employeePortal";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/gateway" element={<Gateway />} />
        <Route path="/employee" element={<EmployeePortal />} />
      </Routes>
    </div>
  );
};

export default App;