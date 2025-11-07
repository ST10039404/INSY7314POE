import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./css.css"
export default function Login() {
    const [form, setForm] = useState({
        username: "",
        accNumber: "",
        password: "",
    });
    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {



        e.preventDefault();

        const newPerson = { ...form };

        const response = await fetch("https://localhost:3001/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
        .catch(error => {
            window.alert(error);
            return;
        });

        const data = await response.json();
        const { token, username } = data;
        console.log(username + " " + token)

        localStorage.setItem("jwt", token);
        localStorage.setItem("username", username);

        setForm({ username: "", password: ""});
        navigate("/");
    }

    return (
        <div>
            <div className="centre-the-div">
                <div>
                    <center><h3>Login</h3></center>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={form.username}
                                onChange={(e) => updateForm({ username: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="accNumber">Account Number</label>
                            <input
                            type="text"
                            className="form-control"
                            id="accNumber"
                            value={form.accNumber}
                            onChange={(e) => updateForm({ accNumber: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                            type="text"
                            className="form-control"
                            id="password"
                            value={form.password}
                            onChange={(e) => updateForm({ password: e.target.value })}
                            />
                        </div>

                        <div className="form-group centre-the-div">
                            <input
                                type="submit"
                                value="Login"
                                className="btn btn-primary"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}