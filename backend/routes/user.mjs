import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
// import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit, { MemoryStore } from "express-rate-limit"
import { checkAuthEmp } from "../check-auth.mjs";
import fs from "fs/promises";
import path from "path";

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

    const usersFile = path.join(process.cwd(), "seeds", "users.json");
    const paymentsFile = path.join(process.cwd(), "seeds", "payments.json");

    const seedUsers = JSON.parse(await fs.readFile(usersFile, "utf-8"));
    const seedPayments = JSON.parse(await fs.readFile(paymentsFile, "utf-8"));

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

    await payments.insertMany(seedPayments)

    res.status(200).send({message: "Succesfully reset user and payments!"})
    
});

export { antibruteforce }
export default router;