import React, { useState } from "react";
import { useNavigate } from "react-router";
import './css.css'


export default function PostPayment() {
        const [form, setForm] = useState({
                accNumber: 0,
                recipientAccNumber: 0,
                currency: "",
                paymentQuantity: "",
            });

            
    const navigate = useNavigate();

            function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const newPerson = {username: localStorage.getItem("username"), ...form };

        await fetch("https://localhost:3001/payment/post", {
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

        setForm({accNumber: 0, recipientAccNumber: 0, currency: "", paymentQuantity: ""});
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
                                    <label htmlFor="currency">Payment Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="currency"
                                        value={form.currency}
                                        onChange={(e) => updateForm({ currency: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="paymentQuantity">Payment Quantity</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="paymentQuantity"
                                    value={form.paymentQuantity}
                                    onChange={(e) => updateForm({ paymentQuantity: e.target.value })}
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