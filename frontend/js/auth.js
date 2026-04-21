const API_URL = 'https://talonstudios-github-io.onrender.com/api'

// ================= REGISTER =================
const registerForm = document.getElementById('register-container')

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message
        return
      }

      document.getElementById('successMsg').textContent = 'Registered! Redirecting...'
      setTimeout(() => window.location.href = 'login.html', 1500)

    } catch {
      document.getElementById('errorMsg').textContent = 'Server error'
    }
  })
}

// ================= LOGIN =================
const loginForm = document.getElementById('login-container')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message
        return
      }

      localStorage.setItem('token', data.token)
      window.location.href = 'admin.html'

    } catch {
      document.getElementById('errorMsg').textContent = 'Server not running'
    }
  })
}
