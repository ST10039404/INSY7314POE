import React, { useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import './css.css'


export default function PostPayment() {
        const [form, setForm] = useState({
                recipientName: "",
                recipientAccNumber: "",
                paymentCurrency: "",
                paymentQuantity: "",
                provider: "",
                SWIFTCode: ""
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
        const decoded = jwtDecode(token);
        const newPayment = {username: decoded.username, accountNumber: decoded.accountnumber, ...form };

        await fetch("https://localhost:3001/payment/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(newPayment),
        })
        .catch(error => {
            console.log(error);
            window.alert(error); 
            return;
        });

        setForm({
                recipientName: "",
                recipientAccNumber: "",
                paymentCurrency: "",
                paymentQuantity: "",
                provider: "",
                SWIFTCode: ""
            });
        navigate("/");
    }

        

        return (
            <div>
                <div>
                    <div className="centre-the-div">
                        <div>
                            <center><h3>Payment Gateway</h3></center>
                            <form onSubmit={onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="recipientName">Recipient Name</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="recipientName"
                                    value={form.recipientName}
                                    onChange={(e) => updateForm({ recipientName: e.target.value })}
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
                                    <label htmlFor="paymentCurrency">Payment Currency</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="paymentCurrency"
                                        value={form.paymentCurrency}
                                        onChange={(e) => updateForm({ paymentCurrency: e.target.value })}
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
                                <div className="form-group">
                                    <label htmlFor="provider">Provider</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="provider"
                                    value={form.provider}
                                    onChange={(e) => updateForm({ provider: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="SWIFTCode">SWIFT Code</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="SWIFTCode"
                                    value={form.SWIFTCode}
                                    onChange={(e) => updateForm({ SWIFTCode: e.target.value })}
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