import https from "https";
import fs from "fs";
import payments from "./routes/payment.mjs";
import users from "./routes/user.mjs"; 
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

console.log('ATLAS_URI:', process.env.ATLAS_URI); //Debugging if code is okay.

const PORT = 3001; 
const app = express();
const options = {
    key: fs.readFileSync('keys/privatekey.pem'), 
    cert: fs.readFileSync('keys/certificate.pem')
}

// Cors Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Helmet Middleware
app.use(helmet());

// Express.json something?
app.use(express.json());

// This was ONCE a fix for something but no more.
// app.use((req, res, next)=>
// {
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Headers',  '*');
// res.setHeader('Access-Control-Allow-Methods', '*');
// next();
// })

//Routes
app.use("/payment", payments);
app.use("/user", users);

//Static frontend files
app.use(express.static(path.resolve("../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../frontend/build/index.html"));
});

// Create server
let server = https.createServer (options, app)
console.log(PORT)
server.listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

export default app;