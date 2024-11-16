document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const credencial = JSON.parse(localStorage.getItem('credenciales'));
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const validacion = credencial.find(
      (v) => v.email === email && v.password === password
    );

    if (validacion) {
      localStorage.setItem('validado', JSON.stringify(validacion));
      window.location.href = "inicio.html";
    } else {
      loginError.style.display = "block";
    }
  });
});
