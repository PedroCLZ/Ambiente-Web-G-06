document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const loginError = document.getElementById('login-error');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Enviar la solicitud al servidor:
      const response = await fetch('backend/login.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ email: email, password: password })
      });

      // Manejo de la respuesta
      const result = await response.json(); 

      if (response.ok) {
        // Comprobar si es el usuario administrador específico
        if (email === 'admin@example.com' && password === '123456') {
          window.location.href = "inicio_admin.html"; // Redirigir al dashboard de administrador
        } else {
          window.location.href = "inicio.html"; // Redirigir a la página estándar
        }
      } else {
        // Mostrar error si el servidor devuelve un error
        loginError.style.display = 'block';
        loginError.textContent = result.error || 'Invalid username/password';
      }
    } catch (error) {
      // Manejo de errores generales
      loginError.style.display = 'block';
      loginError.textContent = 'There was an error processing your request';
    }


  });
})
