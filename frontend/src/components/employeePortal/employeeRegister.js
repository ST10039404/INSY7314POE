import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./css.css"

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        idNumber: "",
        role: "",
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

        const token = localStorage.getItem("token")
        const newPerson = { ...form };

        await fetch("https://localhost:3001/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(newPerson),
        })
        .catch(error => {
            console.log(error);
            window.alert(error);
            return;
        });

        setForm({username: "", idNumber: 0, accNumber: 0, password: ""});
        navigate("/");
    }

    return (
        <div>
            <div className="centre-the-div">
                <div>
                    <center><h3>Register</h3></center>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={form.username}
                                onChange={(e) => updateForm({ username: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="idNumber">ID Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="idNumber"
                                value={form.idNumber}
                                onChange={(e) => updateForm({ idNumber: e.target.value })}
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
                            <label htmlFor="role">User Role</label>
                            <select
                                className="form-control"
                                id="role"
                                value={form.role}
                                onChange={(e) => updateForm({ role: e.target.value })}
                            >
                                <option value="">-- Select a Role --</option>
                                <option value="employee">Employee</option>
                                <option value="admin">Customer</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={form.password}
                            onChange={(e) => updateForm({ password: e.target.value })}
                            />
                        </div>

                        <div className="form-group centre-the-div">
                            <input
                                type="submit"
                                value="Create person"
                                className="btn btn-primary"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}