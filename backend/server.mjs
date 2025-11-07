
import https from "https"; 
import http from "http";
import fs from "fs";
import payments from "./routes/payment.mjs";
import users from "./routes/user.mjs"; 
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

console.log('ATLAS_URI:', process.env.ATLAS_URI);

const PORT = 3001; 
const app = express();
const options = {
    key: fs.readFileSync('keys/privatekey.pem'), 
    cert: fs.readFileSync('keys/certificate.pem')
}

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})

);
app.use(helmet());
app.use(express.json());

app.use((req, res, next)=>
{
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers',  '*');
res.setHeader('Access-Control-Allow-Methods', '*');
next();
})

app.use("/payment", payments);
app.use("/user", users);

let server = https.createServer (options, app)
console.log(PORT)
server.listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});