import React from "react";
import logo from "../logo.svg"
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
export default function Navbar() {
    let userRole = null;

    try {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwt_decode(token);
            userRole = decoded.role;
        }
    } catch (err) {
        console.error("Failed to decode token:", err);
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to="/">
                <img style={{"width" : 25 + '%'}} src={logo} alt="Site logo"></img>
                </NavLink>
                <div className="navbar" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <NavLink className="nav-link" to="/login">
                            Login
                        </NavLink>
                        <NavLink className="nav-link" to="/gateway">
                            Gateway
                        </NavLink>
                        {userRole === "employee" && (
                            <NavLink className="nav-link" to="/employee">
                                Employee Portal
                            </NavLink>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
