document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'backend/perfil.php';

  async function cargarUsuario() {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        credentials: 'include', // Incluye cookies/sesión
      });

      if (response.ok) {
        const usuario = await response.json();
        renderUsuario(usuario);
      } else {
        const errorData = await response.json();
        console.error("Error al obtener usuario:", errorData.error || "Error desconocido");
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
    }
  }

  function renderUsuario(usuario) {
    // Actualizamos los elementos con los datos del usuario
    document.getElementById('name').textContent = usuario.username || "Nombre no disponible";
    document.getElementById('email').textContent = usuario.email || "Email no disponible";
  }

  cargarUsuario();
});

