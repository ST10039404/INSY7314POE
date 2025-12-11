import React, { useState } from "react";
import RegisterUser from "./employeeRegister.js"
import PaymentList from "./employeeViewPayments.js"
import "../css.css"

export default function EmployeePortal() {
    const [activeSection, setActiveSection] = useState("register");

    function renderSection() {

        switch(activeSection) {
            case "register":
                return <RegisterUser />;
            case "payments":
                return <PaymentList />;
            default:
                return <div>
                        No home page for employees
                        </div>; //Home page
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
            <button onClick={() => setActiveSection("payments")}>
                View payments
            </button>
            {renderSection()}
        </div>
    );
}