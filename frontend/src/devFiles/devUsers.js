import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../components/css.css"

const User = (props) => (
    <tr>
        <td>{props.user.username}</td>
        <td>{props.user.accountNumber}</td>
        <td>{props.user.role}</td>
        <td>
            <button className ="btn btn-link" onClick={() => {
                props.deleteUser()
            }}>
            Delete
            </button>
        </td>
        <td>
            <button className ="btn btn-link" onClick={() => {
                props.loginUser()
            }}>
            Login
            </button>    
        </td>
    </tr>
);

export default function DevUsers() {
    const [users, setUsers] = useState([]);

    useEffect(()=> {
        async function getUsers() {
            const usersCache = JSON.parse(localStorage.getItem("usersCache"));
            const expired = () => {
                    return !usersCache || (Date.now() >= usersCache.expiry);
                } // thank you again or gate
            if (usersCache && !expired()) {
                console.log("Using cached users");
                setUsers(usersCache.value);
            }
            else
            {
                console.log("Fetching user data");
                const response = await fetch("https://localhost:3001/user/");
                if (!response.ok) {
                    const message = `An error occured: ${response.statusText}`;
                    window.alert(message);
                    return;
                }

            const usersData = await response.json();
            setUsers(usersData);
            if (usersData)
            {
                localStorage.setItem("usersCache", JSON.stringify({
                value: usersData,
                expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
            }));
            }
            }
        }

        getUsers();

        return;
    }, []);

    async function deleteUser(id) {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://localhost:3001/user/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (200 === response.status)
        {
            setUsers(users => users.filter((e1) => e1._id !== id));
        }
        else
        {
            window.alert("Invalid Request : <" + response.status + ">" + response.statusText)
        }
    }

    async function loginUser(id) {    
        const response = await fetch(`https://localhost:3001/user/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        console.log(data)
        const { token } = data;

        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("token-changed"));
        const decoded = jwtDecode(token)
        window.alert("Succesfully logged in! Welcome " + decoded.username)
    }

    function UserList() {
            return users.map((user) => {
                return (
                    <User
                        user={user}
                        deleteUser={() => deleteUser(user._id)}
                        loginUser={() => loginUser(user._id)}
                        key={user._id}
                    />
                )
            });
        }

    return (
            <div className = "container">
                <h3 className="header">Users</h3>
                <table className="table table-striped" style={{marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Account Number</th>
                            <th>Role</th>
                            <th>Delete</th>
                            <th>Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        <UserList />
                    </tbody>
                </table>
            </div>
    );
}