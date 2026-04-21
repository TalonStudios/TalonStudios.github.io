const mongoose = require('mongoose')

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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Game', gameSchema, 'game_collection')