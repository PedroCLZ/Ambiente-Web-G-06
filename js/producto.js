const productosPorCategoria = {
    "Cafés": [
      { nombre: "Café", descripcion: "Café recién preparado.", precio: "$3.00", imagen: "cafe.jpg" },
      { nombre: "Capuchino", descripcion: "Capuchino rico con espuma.", precio: "$3.50", imagen: "capuchino.jpg" },
      { nombre: "Latte", descripcion: "Suave latte con leche al vapor.", precio: "$4.00", imagen: "latte.jpg" }
    ],
    "Desayunos": [
      { nombre: "Croissant", descripcion: "Croissant hojaldrado y mantecoso.", precio: "$2.50", imagen: "croissant.jpg" },
      { nombre: "Bagel", descripcion: "Bagel tostado con queso crema.", precio: "$2.00", imagen: "bagel.jpg" }
    ]
    // Agrega más categorías y productos según sea necesario
  };
  
  
  function mostrarProductos() {
    const listaProductos = document.getElementById("product-list");
    listaProductos.innerHTML = ""; // Limpiar cualquier contenido existente
  
    // Iterar por cada categoría
    for (const [categoria, productos] of Object.entries(productosPorCategoria)) {
      // Crear un título para la categoría
      const tituloCategoria = document.createElement("h3");
      tituloCategoria.textContent = categoria;
      tituloCategoria.classList.add("categoria-titulo"); // Añadir clase para estilizar
      listaProductos.appendChild(tituloCategoria);
  
      // Crear un contenedor para los productos de esta categoría
      const contenedorCategoria = document.createElement("div");
      contenedorCategoria.classList.add("categoria-contenedor");
  
      // Agregar cada producto de la categoría
      productos.forEach((producto) => {
        const itemProducto = document.createElement("div");
        itemProducto.classList.add("product-item");
  
        itemProducto.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <div class="product-name">${producto.nombre}</div>
          <div class="product-price">${producto.precio}</div>
          <div class="product-description">${producto.descripcion}</div>
        `;
  
        contenedorCategoria.appendChild(itemProducto);
      });
  
      listaProductos.appendChild(contenedorCategoria);
    }
  }
  
  // Cargar los productos cuando la página carga
  document.addEventListener("DOMContentLoaded", mostrarProductos);
  