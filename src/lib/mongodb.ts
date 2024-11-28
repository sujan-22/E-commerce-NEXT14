// lib/mongodb.ts
import { MongoClient } from "mongodb";

// Ensure the MongoDB URI is available in environment variables
const uri: string = process.env.MONGODB_URI as string;
const options = {};

// Type for the MongoDB client and promise
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
    // Global variable to preserve the client connection in development mode
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
