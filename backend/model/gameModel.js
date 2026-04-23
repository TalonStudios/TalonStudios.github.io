const mongoose = require('mongoose') // Mongoose is the ODM (Object Data Modeling) library that lets us define schemas and interact with MongoDB using JavaScript objects

const gameSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      // ObjectId is MongoDB's built-in unique ID type — links this note to a specific User document
      
      required: true,                       
      // A note cannot exist without an owner
      
      ref: 'User',                          
      // Tells Mongoose which model this ObjectId points to — enables .populate('user') to fetch full user data in queries
    },
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