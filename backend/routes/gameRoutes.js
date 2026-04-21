const express = require('express')
const router = express.Router()

const {
  getGames,
  setGame,
  updateGame,
  deleteGame
} = require('../controllers/gameController')

const { protect } = require('../middleware/authMiddleware')

// GET all games + CREATE game
router.route('/')
  .get(protect, getGames)
  .post(protect, setGame)

// UPDATE + DELETE by ID
router.route('/:id')
  .put(protect, updateGame)
  .delete(protect, deleteGame)

module.exports = router