document.addEventListener("DOMContentLoaded", function () {
  const validacion = JSON.parse(localStorage.getItem("validado"));

  const email = document.getElementById("email");
  if (validacion) {
    email.textContent = validacion.email;
  }
});
