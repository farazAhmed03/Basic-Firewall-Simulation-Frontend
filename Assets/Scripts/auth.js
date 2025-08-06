document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');

  if (registerBtn) {
    registerBtn.addEventListener('click', registerUser);
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', loginUser);
  }
});

// REGISTER
async function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const res = await fetch('basic-firewall-simulation-production.up.railway.app/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } else {
      alert(`${data.message}`);
    }

  } catch (err) {
    alert('Server error during registration');
    console.error(err);
  }
}

// LOGIN
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('basic-firewall-simulation-production.up.railway.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert(`${data.message}`);
    }

  } catch (err) {
    alert('Server error during login');
    console.error(err);
  }
}
