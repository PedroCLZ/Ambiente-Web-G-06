<?php
// productos.php
include_once 'db.php';
include_once 'functions.php';

// Obtener todos los productos
function obtenerProductos() {
    $sql = "SELECT * FROM productos";
    return obtenerRegistros($sql);
}

// Obtener un producto por su ID
function obtenerProducto($id) {
    $sql = "SELECT * FROM productos WHERE id = :id";
    return obtenerRegistro($sql, ['id' => $id]);
}

// Agregar un nuevo producto
function agregarProducto($nombre, $descripcion, $precio, $categoria, $stock) {
    $sql = "INSERT INTO productos (nombre, descripcion, precio, categoria, stock) 
            VALUES (:nombre, :descripcion, :precio, :categoria, :stock)";
    return ejecutarConsulta($sql, [
        'nombre' => $nombre,
        'descripcion' => $descripcion,
        'precio' => $precio,
        'categoria' => $categoria,
        'stock' => $stock
    ]);
}

// Actualizar un producto
function actualizarProducto($id, $nombre, $descripcion, $precio, $categoria, $stock) {
    $sql = "UPDATE productos SET nombre = :nombre, descripcion = :descripcion, precio = :precio, 
            categoria = :categoria, stock = :stock WHERE id = :id";
    return ejecutarConsulta($sql, [
        'id' => $id,
        'nombre' => $nombre,
        'descripcion' => $descripcion,
        'precio' => $precio,
        'categoria' => $categoria,
        'stock' => $stock
    ]);
}

// Eliminar un producto
function eliminarProducto($id) {
    $sql = "DELETE FROM productos WHERE id = :id";
    return ejecutarConsulta($sql, ['id' => $id]);
}
?>
