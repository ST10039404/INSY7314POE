import https from "https";
import fs from "fs";
import payments from "./routes/payment.mjs";
import users from "./routes/user.mjs"; 
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

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

//Routes
app.use("/payment", payments);
app.use("/user", users);

//Static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Create server
if (process.env.NODE_ENV !== "test") {
  let server = https.createServer (options, app)
  console.log(PORT)
  server.listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

export default app;