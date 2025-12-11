import React, { useState, useEffect } from "react";
import logo from "../logo.svg"
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export default function Navbar() {

    const [user, setUser] = useState(null);

    function loadUserFromToken() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return setUser(null);
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch {
            setUser(null);
        }
    }

    useEffect(() => {
        loadUserFromToken();

        window.addEventListener("token-changed", loadUserFromToken);

        return () => {
            window.removeEventListener("token-changed", loadUserFromToken);
        };
    }, []);

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
                        {user && user.role === "employee" && (
                            <NavLink className="nav-link" to="/employee">
                                Employee Portal
                            </NavLink>
                        )}
                        <NavLink className ="nav-link" to="/devUsers">
                            Dev Users
                        </NavLink>
                    </ul>
                </div>

                {/* Right section — forced to far right */}
                {user && (
                    <>
                    <div className="ms-auto navbar-text" style={{ fontWeight: "bold", background: "yellow" }}>
                        {user.username}
                    </div>
                    <div>

                    </div>
                    </>
                )}
            </nav>
        </div>
    );
}
