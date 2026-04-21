const http = require("http");
const fs = require("fs");
const path = require("path");

const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])
const express = require('express')

const {MongoClient} = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const Game = require('./model/gameModel')

const connectDB = require('./config/db')            // Function that establishes the Mongoose connection to MongoDB Atlas
const { errorHandler } = require('./middleware/errorMiddleware') // Central error handler — catches any error thrown in a controller and returns a clean JSON response instead of crashing
const cors = require('cors')                        // Cross-Origin Resource Sharing — allows the frontend (running on a different port in dev) to make requests to this API

const PORT = 3000;

// DB connection
connectDB();

const app = express();

// Static frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===== PUBLIC API ROUTE (NO AUTH) =====
app.get('/api', async (req, res) => {
  try {
    const games = await Game.find()
    res.json(games)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch games', error: err.message })
  }
})

// API routes
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handler
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);