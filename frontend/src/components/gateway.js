import React, { useState } from "react";
import { useNavigate } from "react-router";
import './css.css'


export default function PostList() {
        const [form, setForm] = useState({
                username: "",
                idNumber: "",
                accNumber: "",
                recipientAccNumber: "",
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

        await fetch("https://localhost:3001/payment/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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

        //function maps post to table
        /*
        function PostList() {
            return posts.map((post) => {
                return (
                    <Post
                        post={post}
                        deletePost={() => deletePost(post._id)}
                        key={post._id}
                    />
                )
            });
        }
            */

        return (
            <div>
                <div>
                    <div className="centre-the-div">
                        <div>
                            <center><h3>INSY Payment Gateway W.I.P</h3></center>
                            <form onSubmit={onSubmit}>
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
                                    <label htmlFor="recipientAccNumber">Recipient Account Number</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="recipientAccNumber"
                                    value={form.recipientAccNumber}
                                    onChange={(e) => updateForm({ recipientAccNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Payment Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={form.username}
                                        onChange={(e) => updateForm({ username: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Payment Quantity</label>
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
                                        value="Payment"
                                        className="btn btn-primary"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}