 
const asyncHandler = require('express-async-handler')
 
const Game = require('../model/gameModel')
const User = require('../model/userModel') // for update and delete

// http://localhost:5555/api/games/
const getGames = asyncHandler(async (req, res) =>{
  
  
    const games = await Game.find({/*user:req.user.id*/})
 
    res.status(200).json(games)
})

// ===== CREATE A GAME =====
const setGame = asyncHandler(async(req, res) => {

 const { project_title, price, genre, image, project_released, project_finished, game_link } = req.body

  if (!project_title) {
    res.status(400)
    throw new Error("Please add a Game Title")
  }


    // Insert a new note document into MongoDB 
    //  .create() both builds and saves the document in one step
    const game_created = await Game.create(
        {
            project_title,
            price,
            genre,
            image,
            project_finished,
            project_released,
            game_link,
            user: req.user.id
        }
    )

    // Send back the newly created note as JSON 
    //  the client gets confirmation of what was saved, 
    // including the auto-generated _id
    res.status(200).json(game_created)
})

// ===== UPDATE A GAME =====
const updateGame =  asyncHandler(async(req, res) => {

    // if we need to update any note - we need an id
    // Look up the note by the id from the URL parameter (e.g., /api/notes/abc123) 
    //  we first check if it exists before trying to update
    const game = await Game.findById(req.params.id) // this will find our note

    // If no note was found with that id, send a 400 error 
    //  prevents updating a non-existent document
    if(!game){
        res.status(400)
        throw new Error("Game not found")
    }

    //-------Only authorized user can update their note---------------
    const user = await User.findById(req.user.id)
    // we want to check if useer exist or not, if yes then they can only update and delete their notes
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    // Only the notes that belong to the user should be modified by that user.
    // if (game.user/*.toString()*/ !== req.user.id) {
    //     res.status(401)
    //     throw new Error('User not authorized')
    //  }
    //--------------------------------------------


    // now lets update the note 
    // Find the note by id and update its text field in one operation
    const updatedGame = await Game.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true 
        }
    )

    // Send back the updated note so the client can see the changes took effect
    res.status(200).json(updatedGame)
})

// ===== DELETE A GAME =====
const deleteGame = asyncHandler(async (req, res) => {

    // Find the note first 
    //  we need the document object to call .deleteOne() on it
    const game = await Game.findById(req.params.id) // this will find our note

    // If the note doesn't exist, tell the client 
    //  prevents trying to delete something that's already gone

    //-------Only authorized user can update their note ---------------
    const user = await User.findById(req.user.id)
    // we want to check if useer exist or not, if yes then they can only update and delete their notes
    if (!game) {
      res.status(404)
      throw new Error("Game not found")
    }

    // check if the note has the user field, because we are adding the user key in the database
    // if (game.user/*.toString()*/ !== req.user.id) {
    //     res.status(401)
    //     throw new Error('User not authorized')
    // }
    //--------------------------------

    // Remove the note from the database 
    //  .deleteOne() is called on the document instance we found above
    await game.deleteOne()

    // Send back a confirmation message with the deleted note's id 
    //  lets the client know which note was removed
    res.status(200).json({ message: `Delete game ${req.params.id}` })
}
)

// Export all four functions so noteRoutes.js can attach them to the corresponding HTTP endpoints
module.exports = {
    getGames,
    setGame,
    updateGame,
    deleteGame
}