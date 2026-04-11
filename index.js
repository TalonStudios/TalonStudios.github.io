const http = require("http");
const fs = require("fs");
const path = require("path");

const {MongoClient} = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;


const client = new MongoClient(uri);

let gamesCollection;
async function connectDB() {
    try{
        await client.connect();
        gamesCollection = client.db("games_database").collection("game_collection");
        console.log("Connected to MongoDB. . .");
    }catch (error) {
        console.error(
            "MongoDB connection failed. . ?: ", error
        );
        //Exit from the entire program
        process.exit(1);
    }
}

const server = http.createServer((req, res) => {
    //Homepage
    if (req.url === "/") {
        fs.readFile(
            path.join(__dirname, "public", "index.html"),
            (err, content) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        );
    }
    
    //For homepage/api
    else if (req.url === "/api") {
        gamesCollection.find({}).toArray().then(
            results => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(results));
            }
        ).catch(error => {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: "Failed to fetch the games."}));
        })
    }

    //Give a 404 error for anything else
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

//Runs the server on this port
const PORT= 3000;
// port, callback
connectDB().then(
    ()=> {
        server.listen(PORT, ()=> console.log("Server running. . ."));
    }
);
