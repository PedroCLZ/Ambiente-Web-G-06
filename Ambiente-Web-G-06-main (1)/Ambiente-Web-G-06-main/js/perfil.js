document.addEventListener("DOMContentLoaded", function () {
  const validacion = JSON.parse(localStorage.getItem('validado'));
  const datos = document.getElementById("per");
  if (validacion) {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-3";
    div.innerHTML = `<div>
          <p>${validacion.email}</p>
          <p>${validacion.password}</p>
          </div>`;
          datos.appendChild(div);
  }
});
