const http = require("http");
const fs = require("fs");
const path = require("path");

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
        fs.readFile(
            path.join(__dirname, "public", "db.json"),
            "utf-8",
            (err, content) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading db.json");
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(content);
            }
        );
    }

    //Give a 404 error for anything else
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

//Runs the server on this port
const PORT= process.env.PORT || 3000;
// port, callback
server.listen(PORT,()=> {
    console.log(`server running on port ${PORT} `)
});