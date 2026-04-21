const API_URL = 'https://talonstudios-github-io.onrender.com/api'

// ================= TOKEN CHECK =================
function getToken() {
  return localStorage.getItem('token')
}

function authHeader() {
  const token = getToken()

  if (!token) {
    window.location.href = 'login.html'
    return {}
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// ================= LOGOUT =================
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'login.html'
})

// ================= GET GAMES =================
async function getGames() {

  const res = await fetch(`${API_URL}`, {
    method: 'GET',
    headers: authHeader()
  })

  let data

  try {
    data = await res.json()
  } catch {
    document.getElementById('products').textContent =
      'Server error'
    return
  }

  if (!res.ok) {
    document.getElementById('products').textContent =
      data.message || 'Failed to load games'
    return
  }

  renderGames(data)
}

// ================= RENDER =================
function renderGames(games) {
  const container = document.getElementById('products')
  container.innerHTML = ''

  if (!games || games.length === 0) {
    container.textContent = 'No games found'
    return
  }

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

// ================= CREATE =================
document.getElementById('createGameForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const project_title = document.getElementById('title').value
  const price = document.getElementById('price').value
  const genre = document.getElementById('genre').value
  const project_released = document.getElementById('released').value
  const project_finished = document.getElementById('finished').value
  const game_link = document.getElementById('gameurl').value
  const image = document.getElementById('image').value

  const res = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ project_title, price, genre })
  })

  let data = await res.json()

  if (!res.ok) {
    document.getElementById('createMsg').textContent =
      data.message || 'Failed to create game'
    return
  }

  document.getElementById('createMsg').textContent = 'Game created!'
  getGames()
})

// ================= DELETE =================
async function deleteGame(id) {

  const res = await fetch(`${API_URL}/games/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  let data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Delete failed')
    return
  }

  getGames()
}

// ===== SHOW EDIT FORM =====
// Called when user clicks Edit button on a game card
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
// Hide edit form without saving
document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editSection').style.display = 'none'
})
// ===== SAVE EDIT =====
document.getElementById('saveEditBtn').addEventListener('click', async () => {

  const id = document.getElementById('editid').value

  const res = await fetch(`${API_URL}/games/${id}`, {
    method: 'PUT',
    headers: authHeader(),
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
    document.getElementById('editMsg').textContent = data.message || 'Update failed'
    return
  }

  document.getElementById('editMsg').style.color = 'green'
  document.getElementById('editMsg').textContent = 'Game updated!'
  document.getElementById('editSection').style.display = 'none'

  getGames()
})

// ================= INIT =================
getGames()
