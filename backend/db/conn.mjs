import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.ATLAS_URI

const client = new MongoClient(connectionString);

try {
    await client.connect();
    console.log('connected to mongoDB')
} catch(e) {
    console.error(e);
}

let db = client.db("users");

export default db;