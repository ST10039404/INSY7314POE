import React, { useState } from "react";
import RegisterUser from "./components/employeePortal/employeeRegister"
import "../css.css"

export default function EmployeePortal() {
    const [activeSection, setActiveSection] = useState("register");

    function renderSection() {
        
        switch(activeSection) {
            case "register":
                return <RegisterUser />;
            default:
                return null; //Home page
        }
    }

    return (
        <div>
            <h2>Employee Portal</h2>
            <button onClick={() => setActiveSection("Home")}>
                Home
            </button>
            <button onClick={() => setActiveSection("register")}>
                Register User
            </button>
            {renderSection()}
        </div>
    );
}