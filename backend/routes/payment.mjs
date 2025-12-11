import express from "express";
import db from "../db/conn.mjs"
import { ObjectId } from "mongodb";
import { checkAuthEmp } from "../check-auth.mjs";

const router = express.Router();

/**
 * @route   GET payment/
 * @desc    Return all payments
 * @access  Private
 */

router.get("/", checkAuthEmp, async (req, res) => {
    let collection = await db.collection("payments");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

/**
 * @route   POST payment/upload
 * @desc    Add new payment
 * @access  Private
 */

router.post("/upload", checkAuthEmp, async (req, res) => {
    let newPayment = {
        username: req.body.username,
        accountNumber: req.body.accountNumber,
        recipientName: req.body.recipientName,
        recipientAccNumber: req.body.recipientAccNumber,
        paymentCurrency: req.body.paymentCurrency,
        paymentQuantity: req.body.paymentQuantity,
        provider: req.body.provider,
        SWIFTCode: req.body.SWIFTCode,
        State: "Waiting"
    };
    try {
    let collection = await db.collection("payments");
    let result = await collection.insertOne(newPayment);
    res.status(201).send(result);
    } catch(e) {
        res.status(500).send({
            message: "Internal server error while creating payment",
            error: e.message
        })
    }
    
});

/**
 * @route   GET payment/{id}
 * @desc    Return specific payment with matching id
 * @access  Private
 */
router.get("/:id", checkAuthEmp, async (req, res) => {
    let collection = await db.collection("payments");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) res.status(404).send({
        message: "Payments not found"
    });
    else res.status(200).send(result);
});

/**
 * @route   PATCH payment/{id}
 * @desc    update an existing payment
 * @access  Private
 */

router.patch("/:id", checkAuthEmp, async (req, res) => {
    try {
        const collection = await db.collection("payments");

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { state: req.body.state } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json({ message: "Payment updated successfully" });
    } catch (e) {
        res.status(500).json({
            message: "Internal server error while updating payment",
            error: e.message
        });
    }
});

/**
 * @route   GET payment/{id}
 * @desc    Return specific payment with matching id
 * @access  Private
 */
router.delete("/:id", checkAuthEmp, async (req, res) => {
    let collection = await db.collection("payments");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.deleteOne(query);

    if (!result) res.status(404).send({
        message: "Payments not found"
    });
    else res.status(200).send(result);
});

export default router;