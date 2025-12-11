import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./css.css"
export default function Login() {
    const [form, setForm] = useState({
        username: "",
        accountNumber: "",
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

        const newPerson = { ...form,  };

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
        const { token } = data;

        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("token-changed"));
        window.alert("Succesfully logged in! Welcome " + form.username)
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
                            <label htmlFor="accountNumber">Account Number</label>
                            <input
                            type="text"
                            className="form-control"
                            id="accountNumber"
                            value={form.accountNumber}
                            onChange={(e) => updateForm({ accountNumber: e.target.value })}
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