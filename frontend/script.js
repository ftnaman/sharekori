document.addEventListener('DOMContentLoaded', () => {
  // ------------------------
  // Registration Form
  // ------------------------
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const registerMessage = document.getElementById('registerMessage');

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        });

        const data = await res.json();

        if (res.ok) {
          registerMessage.style.color = 'green';
          registerMessage.textContent = 'Registration successful! Redirecting to login...';
          registerForm.reset();

          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1000);
        } else {
          registerMessage.style.color = 'red';
          registerMessage.textContent = data.error || 'Registration failed';
        }
      } catch (err) {
        registerMessage.style.color = 'red';
        registerMessage.textContent = 'Server error';
        console.error(err);
      }
    });
  }

  // ------------------------
  // Login Form
  // ------------------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          loginMessage.style.color = 'green';
          loginMessage.textContent = 'Login successful! Redirecting to dashboard...';

          // Save JWT token
          localStorage.setItem('token', data.token);

          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1000);
        } else {
          loginMessage.style.color = 'red';
          loginMessage.textContent = data.error || 'Login failed';
        }
      } catch (err) {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Server error';
        console.error(err);
      }
    });
  }
});