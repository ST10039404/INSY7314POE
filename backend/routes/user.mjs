import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit, { MemoryStore } from "express-rate-limit"
import crypto from "crypto";
import dotenv from "dotenv";
import { resourceLimits } from "worker_threads";
import { checkauth, empRole } from "../check-auth.mjs";

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

const iterations = Number(process.env.PBKDF2_Iterations);
const keylen = Number(process.env.PBKDF2_Keylen);
const digest = process.env.PBKDF2_Digest;
const hmackey = process.env.HMACKey;

const passwordStuff = async (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHmac("sha256", hmackey).update(password).digest("hex");
    const passwordEncrypted = await crypto.pbkdf2(Buffer.from(hash, "hex"), Buffer.from(salt, "hex"), iterations, keylen, digest);

    const passInfo = {salt: salt, password: passwordEncrypted, hash: hash};
    return passInfo;
};

const passwordCheck = async(password, user) => {
    const hashCheck = crypto.createHmac("sha256", hmackey).update(password).digest("hex");
    const a = Buffer.from(await crypto.pbkdf2(Buffer.from(hashCheck, "hex"), Buffer.from(user.salt, "hex"), iterations, keylen, digest))
    const b = Buffer.from(user.password)
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b)
};

const employeeCheck = async(user) => {

}

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

router.post("/signup", empRole,  async (req, res) => {

    /*
    if (validater([req.body.username, req.body.idNumber, req.body.accNumber]).findOne(false))
        {
            res.send(result).status(422);
        }*/

            console.log("hello")

    const passwordInfo = async() => await passwordStuff(req.body.password);

    let newDocument = {
        accNumber: req.body.accNumber,
        username: req.body.username,
        idNumber: req.body.idNumber,
        role: req.body.role,
        password: passwordInfo.password,
        salt: passwordInfo.salt,
        hash: passwordInfo.hash,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});


router.post("/login", antibruteforce, async (req, res) => {
    const { username, accNumber, password } = req.body;

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ accNumber });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

    const passwordMatch = passwordCheck(password, user)

    if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
    }
    else{
    const token = jwt.sign({username:req.body.username, role: req.body.role},process.env.JWTSECRET,{expiresIn:"1h"});
    res.status(200).json({ message: "Authentication successful", token: token, name: req.body.name});
    //console.log("your new token is", token)
    }
        } catch (error) {
            //console.error("Login error:", error);
            res.status(500).json({ message: "Login failed" });
        }
});

export { antibruteforce }
export default router;