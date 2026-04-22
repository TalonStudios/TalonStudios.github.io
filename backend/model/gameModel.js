const mongoose = require('mongoose') // Mongoose is the ODM (Object Data Modeling) library that lets us define schemas and interact with MongoDB using JavaScript objects

const gameSchema = mongoose.Schema(
  {
    id: Number,
    project_title: String,
    image: String,
    price: Number,
    project_finished: Boolean,
    project_released: Boolean,
    game_link: String,
    genre: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Game', gameSchema, 'game_collection')