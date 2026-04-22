// Base URL for all API requests
// In production, change this to your live domain e.g. 'https://yoursite.com/api'
const API_URL = 'http://localhost:5555/api' // dont forget to change this later

// ===== PROTECT THE PAGE =====
// Read the token that was saved to localStorage when the user logged in
const token = localStorage.getItem('token')

// If there is no token, the user is not logged in — send them back to the login page
if (!token) {
  window.location.href = 'index.html'
  throw new Error('No token') // stops the rest of the script from running

}

// ===== AUTH HEADER HELPER =====
// Every request to a protected route must include the JWT token in the Authorization header
// This function returns the headers object so we don't repeat it everywhere
function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // format required by our authMiddleware.js
  }
}

// ===== LOGOUT =====
// When logout is clicked, remove the token from localStorage and go back to login
// Without the token, the user can no longer make authenticated requests
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'index.html'
})

// ===== GET ALL GAMES =====
async function getGames() {
  // GET /api/games — protected route, needs Authorization header
  const res = await fetch(`${API_URL}/games`, {
    method: 'GET',
    headers: authHeader()
  })

  const games = await res.json()
  console.log("GAMES RESPONSE:", games);
  if (!res.ok) {
    // If the request failed, show the error in the games container
    document.getElementById('products').textContent = games.message || 'Failed to load games'
    return
  }

  // Pass the games array to the render function to display them on the page
  renderGames(games)
}

// ===== RENDER NOTES TO THE PAGE =====
function renderGames(games) {
  const container = document.getElementById('products')

  // Clear whatever was previously rendered so we don't get duplicates
  container.innerHTML = ''

  if (games.length === 0) {
    container.textContent = 'No games yet. Add one above!'
    return
  }

  // Loop through each note and create HTML elements for it
  games.forEach(game => {
    const div = document.createElement('div')
    div.classList.add('game-card')
    div.innerHTML = `
<p><strong>ID:</strong> ${game._id}</p>
      <p><strong>Title:</strong> ${game.project_title}</p>
      <p><strong>Price:</strong> $${game.price}</p>
      <p><strong>Genre:</strong> ${game.genre}</p>
      <p><strong>Finished:</strong> ${game.project_finished}</p>
      <p><strong>Published:</strong> ${game.project_released}</p>
      <p><strong>Game Link:</strong> ${game.game_link}</p
      <p><strong>Image Link:</strong> ${game.image}</p>

      <button onclick="deleteGame('${game._id}')">Delete</button>
      <button onclick="startEdit('${game._id}', '${game.project_title}', '${game.price}', '${game.genre}', '${game.project_released}', '${game.project_finished}', '${game.game_link}', '${game.image}')">Edit</button>
      <hr>
    `
    container.appendChild(div)
  })
}

// ===== CREATE A NOTE =====
document.getElementById('createGameForm').addEventListener('submit', async (e) => {
  // Prevent page refresh on form submit
  e.preventDefault()

  const project_title = document.getElementById('title').value
  const price = document.getElementById('price').value
  const genre = document.getElementById('genre').value
  const project_released = document.getElementById('released').value
  const project_finished = document.getElementById('finished').value
  const game_link = document.getElementById('gameurl').value
  const image = document.getElementById('image').value

  // POST /api/games — sends the note text in the request body
  const res = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers:authHeader(),
    body: JSON.stringify({project_title,
  price,
  genre,
  project_released,
  project_finished,
  game_link,
  image})
  })

  const data = await res.json()

if (!res.ok) {
    document.getElementById('createMsg').style.color = 'red'
    document.getElementById('createMsg').textContent = data.message || 'Failed to create note'
    return
  }

  document.getElementById('createMsg').style.color = 'green'
  document.getElementById('createMsg').textContent = 'Game created!'
  document.getElementById('title').value = ''
  document.getElementById('price').value = ''
  document.getElementById('genre').value = ''
  document.getElementById('released').value = ''
  document.getElementById('finished').value = ''
  document.getElementById('gameurl').value = ''
  document.getElementById('image').value = ''
  getGames()
})

// ===== DELETE A GAME =====
async function deleteGame(id) {
  // Ask the user to confirm before permanently deleting
  const confirmed = confirm('Are you sure you want to delete this game?')
  if (!confirmed) return
  // DELETE /api/games/:id — the id is in the URL, no request body needed
  const res = await fetch(`${API_URL}/games/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Failed to delete game')
    return
  }
  // Refresh the list so the deleted note disappears
  getGames()
}

// ===== SHOW EDIT FORM =====
// Called when the user clicks the Edit button on a note
// Populates the hidden edit section with the current note's id and text
function startEdit(id, project_title, price, genre, project_released, project_finished, game_link, image) {
 document.getElementById('editSection').style.display = 'block'

  document.getElementById('editid').value = id || ''
  document.getElementById('edittitle').value = project_title || ''
  document.getElementById('editprice').value = price || ''
  document.getElementById('editgenre').value = genre || ''
  document.getElementById('editreleased').value = project_released || false
  document.getElementById('editfinished').value = project_finished || false
  document.getElementById('editgameurl').value = game_link || ''
  document.getElementById('editimage').value = image || ''

  document.getElementById('editMsg').textContent = ''
  document.getElementById('editSection').scrollIntoView()
}

// ===== CANCEL EDIT =====
// Hide the edit form without making any changes
document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editSection').style.display = 'none'
})

// ===== SAVE EDIT =====
document.getElementById('saveEditBtn').addEventListener('click', async () => {
  // Read the note id (from the hidden input) and the updated text
 const id = document.getElementById('editid').value

  const res = await fetch(`${API_URL}/games/${id}`, {
    method: 'PUT',
    headers:authHeader(),
    body: JSON.stringify({
      project_title: document.getElementById('edittitle').value,
      price: document.getElementById('editprice').value,
      genre: document.getElementById('editgenre').value,
      project_released: document.getElementById('editreleased').value,
      project_finished: document.getElementById('editfinished').value,
      game_link: document.getElementById('editgameurl').value,
      image: document.getElementById('editimage').value
    })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('editMsg').style.color = 'red'
    document.getElementById('editMsg').textContent = data.message || 'Failed to update note'
    return
  }

  // Show success, hide the edit form, and refresh the notes list
  document.getElementById('editMsg').style.color = 'green'
  document.getElementById('editMsg').textContent = 'Note updated!'
  document.getElementById('editSection').style.display = 'none'
  getGames()
})

// ===== LOAD NOTES ON PAGE LOAD =====
// Automatically fetch and display all notes when dashboard.html is opened
getGames()