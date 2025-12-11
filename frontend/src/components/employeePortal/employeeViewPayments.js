import React, { useEffect, useState } from "react";
import "../css.css"

const Payment = (props) => (
    <tr>
        <td>{props.payment.username}</td>
        <td>{props.payment.accountNumber}</td>
        <td>{props.payment.recipientName}</td>
        <td>{props.payment.recipientAccNumber}</td>
        <td>{props.payment.paymentCurrency}</td>
        <td>{props.payment.paymentQuantity}</td>
        <td>{props.payment.SWIFTCode}</td>
        <td>{props.payment.provider}</td>
        <td>{props.payment.State}</td>
        <td>
            <button className ="btn btn-link" onClick={() => {
                props.deletePayment()
            }}>
            Delete
            </button>
        </td>
        <td>
            <button className ="btn btn-link" onClick={() => {
                props.denyPayment()
            }}>
            Deny
            </button>
        </td>
        <td>
            <button className ="btn btn-link" onClick={() => {
                props.acceptPayment()
            }}>
            Accept
            </button>
        </td>
    </tr>
);

export default function EmployeeViewPayments() {
    const [payments, setPayments] = useState([]);

    useEffect(()=> {
        async function getPayments() {
            const paymentsCache = JSON.parse(localStorage.getItem("paymentsCache"));
            const expired = () => {
                    return !paymentsCache || (Date.now() >= paymentsCache.expiry);
                } // thank you or gate
            if (paymentsCache && !expired()) {
                console.log("Using paymentsCache payments");
                setPayments(paymentsCache.value);
            }
            else
            {
                const token = localStorage.getItem("token");
                console.log("Fetching payments from DB");
                const response = await fetch("https://localhost:3001/payment/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                });

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                
                return;
            }

            const paymentsData = await response.json();
            console.log(paymentsData);
            setPayments(paymentsData);
            
            if (paymentsData)
            localStorage.setItem("paymentsCache", JSON.stringify({
                value: paymentsData,
                expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
            }));
            } 
        }

        getPayments();

        return;
    }, []);

    async function deletePayment(id) {
        const token = localStorage.getItem("token");

        await fetch(`https://localhost:3001/payment/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        setPayments(payments => payments.filter((e1) => e1._id !== id));
    }

    async function denyPayment(id) {
        const token = localStorage.getItem("token");
    
        await fetch(`https://localhost:3001/payment/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ State: "Denied" })
        });

        setPayments(payments =>
        payments.map(payment =>
            payment._id === id ? { ...payment, State: "Denied" } : payment
        )
    );
    }

    async function acceptPayment(id) {
        const token = localStorage.getItem("token");
    
        await fetch(`https://localhost:3001/payment/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ State: "Accepted" })
        });

        setPayments(payments => 
            payments.map(payment =>
            payment._id === id ? { ...payment, State: "Denied" } : payment
        ));
    }

    function PaymentList() {
            return payments.map((payment) => {
                return (
                    <Payment
                        payment={payment}
                        deletePayment={() => deletePayment(payment._id)}
                        denyPayment={() => denyPayment(payment._id)}
                        acceptPayment={() => acceptPayment(payment._id)}
                        key={payment._id}
                    />
                )
            });
        }

    return (
            <div className = "container">
                <h3 className="header">Payments</h3>
                <table className="table table-striped" style={{marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Account Number</th>
                            <th>Recipient Name</th>
                            <th>Recipient Account Number</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Provider</th>
                            <th>Swift Code</th>
                            <th>State</th>
                            <th>Delete</th>
                            <th>Deny</th>
                            <th>Accept</th>
                        </tr>
                    </thead>
                    <tbody>
                        <PaymentList />
                    </tbody>
                </table>
            </div>
    );
}