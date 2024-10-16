// lib/mongodb.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Your MongoDB URI
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so we don't create a new client
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

module.exports = clientPromise; // Change this line
