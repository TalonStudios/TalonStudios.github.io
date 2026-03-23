const http = require("http");
const fs = require("fs");
const path = require("path");

const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://connor:knight1@cknight355.p42a8c0.mongodb.net/?appName=cknight355";
const uri = "mongodb://connor:knight1@ac-qzfmanw-shard-00-00.p42a8c0.mongodb.net:27017,ac-qzfmanw-shard-00-01.p42a8c0.mongodb.net:27017,ac-qzfmanw-shard-00-02.p42a8c0.mongodb.net:27017/?ssl=true&replicaSet=atlas-akyzff-shard-0&authSource=admin&appName=cknight355";
let client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("MongoDB connection successfully established.");
        
    } catch (e) {
        console.log(e);
    }
}

const server = http.createServer(async (req, res) => {

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
        // fs.readFile(
        //     path.join(__dirname, "public", "db.json"),
        //     "utf-8",
        //     (err, content) => {
        //         if (err) {
        //             res.writeHead(500);
        //             return res.end("Error loading db.json");
        //         }

        //         res.writeHead(200, { "Content-Type": "application/json" });
        //         res.end(content);
        //     }
        // );
        try {
            const data = await client.db("games_database").collection("game_collection").find({}).toArray();

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));

        } catch (e) {
            res.writeHead(500);
            res.end("Database error");
            console.error(e);
        }
    }

    //Give a 404 error for anything else
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

main();

//Runs the server on this port
const PORT= process.env.PORT || 3000;
// port, callback
server.listen(PORT,()=> {
    console.log(`server running on port ${PORT} `)
});