const Game = require('../model/gameModel')

// GET ALL GAMES (for logged-in user)
const getGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ user: req.user.id })
  res.status(200).json(games)
})

// CREATE GAME
const setGame = async (req, res) => {

  const { project_title, price, genre, image, game_link } = req.body

  if (!project_title) {
    res.status(400)
    throw new Error("Please add a project_title")
  }

  const game = await Game.create({
    project_title,
    price,
    genre,
    image,
    game_link,
    user: req.user.id
  })

  res.status(200).json(game)
}

// UPDATE GAME
const updateGame = async (req, res) => {

  const updatedGame = await Game.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,          // return updated document
      runValidators: true // ensure schema rules apply
    }
  )

  if (!updatedGame) {
    return res.status(404).json({ message: 'Game not found' })
  }

  res.json(updatedGame)
}

// DELETE GAME
const deleteGame = async (req, res) => {

  const game = await Game.findById(req.params.id)

  if (!game) {
    res.status(404)
    throw new Error("Game not found")
  }

  if (game.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error("Not authorized")
  }

  await game.deleteOne()

  res.status(200).json({ message: "Game deleted" })
}

module.exports = {
  getGames,
  setGame,
  updateGame,
  deleteGame
}