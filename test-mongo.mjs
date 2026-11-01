import fs from "node:fs";
import { MongoClient } from "mongodb";

const env = fs.readFileSync(".env.local", "utf8");
const line = env.split(/\r?\n/).find(x => x.startsWith("MONGODB_URI="));

if (!line) {
  throw new Error("MONGODB_URI not found");
}

const uri = line.slice("MONGODB_URI=".length).trim().replace(/^["']|["']$/g, "");

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000
});

try {
  await client.connect();
  console.log("MONGODB CONNECTED SUCCESSFULLY");
} catch (error) {
  console.error(error);
} finally {
  await client.close();
}
