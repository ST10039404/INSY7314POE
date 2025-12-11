import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
// import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit, { MemoryStore } from "express-rate-limit"
import { checkAuthEmp } from "../check-auth.mjs";

const router = express.Router();

const antibruteforce = rateLimit({
    store: new MemoryStore(),     
    windowMs: 15 * 60 * 1000,     
    limit: 10,                     
    message: {                    
        message: 'Too many login attempts. Please try again later.',
        retryAfter: 'Retry-After header set'
    },
    standardHeaders: true,        
    legacyHeaders: false,
    delayAfter: 3,                
    delayMs: (hits) => Math.min(hits * 1000, 15 * 60 * 1000)
});

const passwordStuff = async (password) => {    
    const saltRounds = 14;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

const passwordCheck = async(password, user) => {
    return await bcrypt.compare(password, user.hash);
};

/*
const validater = async (values) => {
    const users = await db.collection("users");
    const output = new Array(); 
    for (value in values) {
        const existing = users.findOne(value);
        output.push(existing);
    }
    return output;
}*/


/**
 * @route   POST user/signup
 * @desc    Add new user to database
 * @access  Public
 */
router.post("/signup", checkAuthEmp,  async (req, res) => {

    const { accountNumber, username, idNumber, role, password } = req.body;

    if (!accountNumber || !username || !idNumber || !role || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const collection = db.collection("users");
    const existing = await collection.findOne({ username });

    if (existing) {
        return res.status(409).json({ message: "User already exists" });
    }

    const passwordInfo = await passwordStuff(req.body.password);

    let newUser = {
        accountNumber: req.body.accountNumber,
        username: req.body.username,
        idNumber: req.body.idNumber,
        role: req.body.role,
        password: passwordInfo,
    };
    
    let result = await collection.insertOne(newUser);
    res.status(204).send(result);
});

/**
 * @route   POST user/login
 * @desc    Send a login request to server and receive verification
 * @access  Public
 */
router.post("/login", antibruteforce, async (req, res) => {
    const { username, accountNumber, password } = req.body;

    try {
        const collection = db.collection("users");
        const user = await collection.findOne({ username, accountNumber });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

    const passwordMatch = passwordCheck(password, user)

    if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
    }
    else{
    const token = jwt.sign({username: user.username, accountnumber: user.accountnumber, role: user.role},process.env.JWTSECRET,{expiresIn:"1h"});
    res.status(200).json({ message: "Authentication successful", token: token});
    }
        } catch {
            res.status(500).json({ message: "Login failed" });
        }
});

router.delete("/:id", checkAuthEmp, async (req, res) => {
    let collection = await db.collection("users");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.deleteOne(query);

    if (!result) res.status(404).send({
        message: "User not found"
    });
    else res.status(200).send(result);
});

//DEV Method (Used to get entire user list for dev list)
router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//DEV Method (Used in the user list to login to a given user account with mongoDB access, for testing.)
router.get("/:id", async (req, res) => {
    let collection = await db.collection("users");
    let query = {_id: new ObjectId(req.params.id)};
    let user = await collection.findOne(query);

    if (!user) res.status(404).send({
        message: "User not found"
    });
    else{
        const token = jwt.sign({username: user.username, accountnumber: user.accountnumber, role: user.role},process.env.JWTSECRET,{expiresIn:"1h"});
        res.status(200).send({message: "Authentication successful", token: token});
    }
});

router.post("/reset", async (req, res) => {
    let users = await db.collection("users");
    let payments = await db.collection("payments")

    await Promise.all([
        users.deleteMany({}),
        payments.deleteMany({})
    ]);

    const seedUsers = [
    { accountNumber: "1001", username: "user1", idNumber: "9001010001", role: "user", password: "password1" },
    { accountNumber: "1002", username: "user2", idNumber: "9001020002", role: "user", password: "password2" },
    { accountNumber: "1003", username: "user3", idNumber: "9001030003", role: "user", password: "password3" },
    { accountNumber: "2001", username: "employee1", idNumber: "9002010001", role: "employee", password: "password4" },
    { accountNumber: "2002", username: "employee2", idNumber: "9002020002", role: "employee", password: "password5" },
    { accountNumber: "2003", username: "employee3", idNumber: "9002030003", role: "employee", password: "password6" },
    ];

    const usersWithHash = await Promise.all(
        seedUsers.map(async (user) => {
            const hashedPassword = await passwordStuff(user.password);
            return {
                accountNumber: user.accountNumber,
                username: user.username,
                idNumber: user.idNumber,
                role: user.role,
                password: hashedPassword,
            };
        })
    );

    await users.insertMany(usersWithHash);

    const seedPayments =
        [
            {
                username: "user1",
                accountNumber: "1001",
                recipientName: "Michael Turner",
            recipientAccountNumber: "4829110045",
                paymentCurrency: "USD",
                paymentQuantity: 250,
                provider: "Bank of America",
                SWIFTCode: "BOFAUS3N",
                State: "Waiting"
            },
            {
                username: "user2",
                accountNumber: "1002",
                recipientName: "Sarah Jacobs",
                recipientAccountNumber: "9831102290",
                paymentCurrency: "EUR",
                paymentQuantity: 500,
                provider: "Deutsche Bank",
                SWIFTCode: "DEUTDEFF",
                State: "Waiting"
            },
            {
                username: "user3",
                accountNumber: "1003",
                recipientName: "Leonard Price",
                recipientAccountNumber: "7712285590",
                paymentCurrency: "ZAR",
                paymentQuantity: 1200,
                provider: "Standard Bank",
                SWIFTCode: "SBZAZAJJ",
                State: "Waiting"
            },
            {
                username: "user4",
                accountNumber: "1004",
                recipientName: "Emily Carter",
                recipientAccountNumber: "6623459087",
                paymentCurrency: "GBP",
                paymentQuantity: 95,
                provider: "Barclays",
                SWIFTCode: "BARCGB22",
                State: "Waiting"
            },
            {
                username: "user5",
                accountNumber: "1005",
                recipientName: "Jonathan Blake",
                recipientAccountNumber: "5502981776",
                paymentCurrency: "AUD",
                paymentQuantity: 300,
                provider: "Commonwealth Bank",
                SWIFTCode: "CTBAAU2S",
                State: "Waiting"
            },
            {
                username: "user6",
                accountNumber: "1006",
                recipientName: "Oliver Grant",
                recipientAccountNumber: "9038834421",
                paymentCurrency: "USD",
                paymentQuantity: 60,
                provider: "Chase",
                SWIFTCode: "CHASUS33",
                State: "Waiting"
            },
            {
                username: "user1",
                accountNumber: "1001",
                recipientName: "Pieter Van Wyk",
                recipientAccountNumber: "4420011199",
                paymentCurrency: "ZAR",
                paymentQuantity: 780,
                provider: "FNB",
                SWIFTCode: "FIRNZAJJ",
                State: "Waiting"
            },
            {
                username: "user4",
                accountNumber: "1004",
                recipientName: "Helena Morris",
                recipientAccountNumber: "2893407710",
                paymentCurrency: "EUR",
                paymentQuantity: 110,
                provider: "ING",
                SWIFTCode: "INGBNL2A",
                State: "Waiting"
            },
            {
                username: "user2",
                accountNumber: "1002",
                recipientName: "Marcus Reid",
                recipientAccountNumber: "7788223901",
                paymentCurrency: "USD",
                paymentQuantity: 410,
                provider: "Wells Fargo",
                SWIFTCode: "WFBIUS6S",
                State: "Accepted"
            },
            {
                username: "user3",
                accountNumber: "1003",
                recipientName: "Alicia Gomez",
                recipientAccountNumber: "6619082334",
                paymentCurrency: "ZAR",
                paymentQuantity: 1500,
                provider: "Nedbank",
                SWIFTCode: "NEDSZAJJ",
                State: "Denied"
            }
        ]

    await payments.insertMany(seedPayments)

    res.status(200).send({message: "Succesfully reset user and payments!"})
    
});

export { antibruteforce }
export default router;