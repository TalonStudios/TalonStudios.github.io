const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const User = require('./model/userModel')
const bcrypt = require('bcryptjs')

require('dotenv').config();

const Game = require('./model/gameModel');
const connectDB = require('./config/db');
const dns = require('dns')
dns.setServers(['8.8.8.8','1.1.1.1'])

const PORT = 3000;

connectDB();


// --------------------
// Send JSON response
// --------------------
function sendJSON(res, status, data){

  res.writeHead(status,{
    'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'
  });

  res.end(JSON.stringify(data));
}


// --------------------
// Parse request body
// --------------------
function parseBody(req) {
  return new Promise((resolve,reject)=>{
    let body='';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', ()=>{
      resolve(JSON.parse(body || '{}'));
    });

    req.on('error', reject);
  });
}


// --------------------
// Server
// --------------------
const server = http.createServer(async (req,res)=>{
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  console.log(req.method, pathname); // MUST show first


  if (req.method === 'POST' && req.url.startsWith('/api/games')) {

  try {
    const body = await parseBody(req);

    const game = await Game.create(body);
    return sendJSON(res, 201, game);
  }
  catch (err) {
    console.error("CREATE ERROR:", err);
    return sendJSON(res, 500, { message: err.message });
  }
 }


  // DELETE game
  else if(req.method==='DELETE' && req.url.startsWith('/api/games')){

    try{
      const { pathname } = new URL(req.url, `http://${req.headers.host}`);
      const id = pathname.split('/')[3];

      //Likely will NEVER happen, but if something does bug and for somereason it has no id then:
      if (!id) {
      return sendJSON(res, 400, { message: "Missing game ID" });
      }

      await Game.findByIdAndDelete(id);

      return sendJSON(res,200,{message:'Game Deleted'});
    }
    catch(err){
      return sendJSON(res,500,{message:err.message});
    }
  }


  // UPDATE game
  else if (req.method === 'PUT' && req.url.startsWith('/api/games')) {

  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    const id = pathname.split('/')[3];

    const body = await parseBody(req);

    const updated = await Game.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendJSON(res, 404, { message: "Game not found" });
    }

    return sendJSON(res, 200, updated);
  }
  catch (err) {
    // console.error("PUT ERROR:", err);
    return sendJSON(res, 500, { message: err.message });
  }
}

  //Homepage
  else if (req.url === "/") {
    fs.readFile(
      path.join(__dirname, "../frontend", "index.html"),
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

//     //For admin panel
    else if (req.url === "/admin") {
        fs.readFile(
            path.join(__dirname, "../frontend", "admin.html"),
            (err, content) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading admin.html");
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        );
    }

//     //For login
    else if (req.url === "/login") {
        fs.readFile(
            path.join(__dirname, "../frontend", "login.html"),
            (err, content) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading login.html");
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        );
    }

//     //For registering
    else if (req.url === "/register") {
        fs.readFile(
            path.join(__dirname, "../frontend", "register.html"),
            (err, content) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading register.html");
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        );
    }

      else if(req.url ==='/api/games'){

    try{
      const games = await Game.find();

      return sendJSON(res,200,games);
    }
    catch(err){
      return sendJSON(res,500,{message:err.message});
    }
  }

  else if (req.method === "GET" && req.url.startsWith("/js/")) {

  const filePath = path.join(__dirname, "../frontend", req.url);

  return fs.readFile(filePath, (err, content) => {

    if (err) {
      res.writeHead(404);
      return res.end("JS file not found");
    }

    res.writeHead(200, {
      "Content-Type": "text/javascript"
    });

    return res.end(content);
  });
}

else if (req.method === 'POST' && req.url === '/api/users') {

  const body = await parseBody(req)

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(body.password, salt)

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: hashedPassword
  })

  return sendJSON(res, 201, user)
}

else if (req.method === 'POST' && req.url === '/api/users/login') {
  try {
    const body = await parseBody(req)

    const user = await User.findOne({ email: body.email })

    if (!user) {
      return sendJSON(res, 400, { message: 'Invalid credentials' })
    }

    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')

    const isMatch = await bcrypt.compare(body.password, user.password)

    if (!isMatch) {
      return sendJSON(res, 400, { message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    return sendJSON(res, 200, {
      token,
      name: user.name,
      email: user.email
    })

  } catch (err) {
    return sendJSON(res, 500, { message: err.message })
  }
}

  // GET all games
  else if(req.method==='GET' && path==='/api/games'){

    try{
      const games = await Game.find();

      return sendJSON(res,200,games);
    }
    catch(err){
      return sendJSON(res,500,{message:err.message});
    }
  }
  // GET all users
  else if(req.url ==='/api/users'){

    try{
      const users = await User.find();

      return sendJSON(res,200,users);
    }
    catch(err){
      return sendJSON(res,500,{message:err.message});
    }
  }
  else {
      // Not found
  return sendJSON(res,404,{
    message:'Route not found'
  });
  }


});


server.listen(PORT,()=>{
  console.log(`Server running on ${PORT}`);
});