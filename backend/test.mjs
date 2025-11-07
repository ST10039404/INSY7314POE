import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { MongoClient } from "mongodb";
import request from "supertest";
import jwt from "jsonwebtoken";
import assert from "assert";

import { checkauth } from "./check-auth.mjs";
import { antibruteforce } from "./routes/user.mjs";

const RESULTS = [];
const pushResult = (name, ok, errMsg = "") => {
    RESULTS.push({ name, ok, errMsg });
    console.log(`${ok ? "✔ PASS" : "✖ FAIL"}: ${name}${errMsg ? " — " + errMsg : ""}`);
};

const app = express();
app.use(express.json());

app.get("/test-auth", checkauth, (req, res) => res.json({ ok: true, user: req.user }));
app.post("/test-brute", antibruteforce, (req, res) => res.json({ ok: true }));

// DB test
async function testDbConnection() {
    const name = "Mongodb connection:";
    const connectionString = process.env.ATLAS_URI
    console.log(process.env.ATLAS_URI)
    if (!connectionString) {
        pushResult(name, false, "ATLAS_URI not set");
        return;
    }
    const client = new MongoClient(connectionString);
    let conn;
    try {
        conn = await client.connect();
            pushResult(name, true);
        } catch(e) {
            pushResult(name, false, e.message);
        }
}
//

// check-auth tests
async function testAuth() {
    const name = "check-auth:";
    try {
        const token = jwt.sign({ username: "testGuy", role: "employee" }, process.env.JWTSECRET, { expiresIn: "1h" });

        const resNo = await request(app).get("/test-auth");
        assert(resNo.status === 401 || resNo.status === 403, `expected 401/403, got ${resNo.status}`);

        const resOk = await request(app).get("/test-auth").set("Authorization", `Bearer ${token}`);
        assert(resOk.status === 200, `expected 200, got ${resOk.status}`);
        assert(resOk.body.user && resOk.body.user.username === "testGuy", "unexpected user payload");

        pushResult(name, true);
    } catch (err) {
        pushResult(name, false, err.message);
    }
}
//

// brute-force test
async function testBrute() {
    const name = "Brute-force protection test";
    try {
        for (let i = 0; i < 10; i++) {
        const r = await request(app).post("/test-brute").send({ username: "test", password: "test" });
        if (i < 3) {
            if (r.status !== 200) 
                throw new Error(`expected 200 early, got ${r.status}`);
        } else {
            if (![200, 429, 403].includes(r.status)) 
                throw new Error(`unexpected status ${r.status} on iteration ${i}`);
        }
        }
        const b = await request(app).post("/test-brute").send({ username: "test", password: "test" });
        if (b.status !== 429)
            throw new Error(`Expected 429 on 11th request, got ${b.status}`);
        pushResult(name, true);
    } catch (e) {
        pushResult(name, false, e.message);
    }
}
//

// Driver
async function main() {
    console.log("Starting tests...");
    await testDbConnection();
    await testAuth();
    await testBrute();

    console.log("\n--- SUMMARY ---");
    let failed = 0;
    for (const r of RESULTS) {
        if (!r.ok) failed++;
    }
    
    process.exitCode = failed > 0 ? 1 : 0;
}

main().catch(e => {
    console.error("Test error:", e);
    process.exitCode = 2;
});
//