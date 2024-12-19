<?php
// proveedores.php
include_once 'db.php';
include_once 'functions.php';

// Obtener todos los proveedores
function obtenerProveedores() {
    $sql = "SELECT * FROM proveedores";
    return obtenerRegistros($sql);
}

// Obtener un proveedor por su ID
function obtenerProveedor($id) {
    $sql = "SELECT * FROM proveedores WHERE id = :id";
    return obtenerRegistro($sql, ['id' => $id]);
}

// Agregar un nuevo proveedor
function agregarProveedor($nombre, $contacto_nombre, $telefono, $direccion, $email) {
    $sql = "INSERT INTO proveedores (nombre, contacto_nombre, telefono, direccion, email) 
            VALUES (:nombre, :contacto_nombre, :telefono, :direccion, :email)";
    return ejecutarConsulta($sql, [
        'nombre' => $nombre,
        'contacto_nombre' => $contacto_nombre,
        'telefono' => $telefono,
        'direccion' => $direccion,
        'email' => $email
    ]);
}

// Actualizar un proveedor
function actualizarProveedor($id, $nombre, $contacto_nombre, $telefono, $direccion, $email) {
    $sql = "UPDATE proveedores SET nombre = :nombre, contacto_nombre = :contacto_nombre, telefono = :telefono, 
            direccion = :direccion, email = :email WHERE id = :id";
    return ejecutarConsulta($sql, [
        'id' => $id,
        'nombre' => $nombre,
        'contacto_nombre' => $contacto_nombre,
        'telefono' => $telefono,
        'direccion' => $direccion,
        'email' => $email
    ]);
}

// Eliminar un proveedor
function eliminarProveedor($id) {
    $sql = "DELETE FROM proveedores WHERE id = :id";
    return ejecutarConsulta($sql, ['id' => $id]);
}
?>
