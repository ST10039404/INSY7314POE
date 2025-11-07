import express from "express";
import db from "../db/conn.mjs"
import { ObjectId } from "mongodb";
import checkauth from "../check-auth.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await db.collection("posts");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

//C = Create
router.post("/upload", checkauth, async (req, res) => {

    let newDocument = {
        accNumber: req.body.accNum,
        recipientAccNumber: req.body.recipientAccNumber,
        paymentCurrency: req.body.paymentCurrency,
        paymentQuantity: req.body.paymentQuantity,
    };
    try {
    let collection = await db.collection("payments");
    let result = await collection.insertOne(newDocument);
    res.status(201).send(result);
    } catch(e) {
        res.status(500).send({
            message: "Internal server error while creating payment",
            error: e.message
        })
    }
    
});
//R = Read
router.get("/:id", async (req, res) => {
    let collection = await db.collection("payments");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) res.status(404).send({
        message: "Payments not found"
    });
    else res.status(200).send(result);
});

export default router;