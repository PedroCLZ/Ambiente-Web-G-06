<?php
// empleados.php
include_once 'db.php';
include_once 'functions.php';

// Obtener todos los empleados
function obtenerEmpleados() {
    $sql = "SELECT * FROM empleados";
    return obtenerRegistros($sql);
}

// Obtener un empleado por su ID
function obtenerEmpleado($id) {
    $sql = "SELECT * FROM empleados WHERE id = :id";
    return obtenerRegistro($sql, ['id' => $id]);
}

// Agregar un nuevo empleado
function agregarEmpleado($nombre, $puesto, $salario, $fecha_ingreso) {
    $sql = "INSERT INTO empleados (nombre, puesto, salario, fecha_ingreso) 
            VALUES (:nombre, :puesto, :salario, :fecha_ingreso)";
    return ejecutarConsulta($sql, [
        'nombre' => $nombre,
        'puesto' => $puesto,
        'salario' => $salario,
        'fecha_ingreso' => $fecha_ingreso
    ]);
}

// Actualizar un empleado
function actualizarEmpleado($id, $nombre, $puesto, $salario, $fecha_ingreso) {
    $sql = "UPDATE empleados SET nombre = :nombre, puesto = :puesto, salario = :salario, 
            fecha_ingreso = :fecha_ingreso WHERE id = :id";
    return ejecutarConsulta($sql, [
        'id' => $id,
        'nombre' => $nombre,
        'puesto' => $puesto,
        'salario' => $salario,
        'fecha_ingreso' => $fecha_ingreso
    ]);
}

// Eliminar un empleado
function eliminarEmpleado($id) {
    $sql = "DELETE FROM empleados WHERE id = :id";
    return ejecutarConsulta($sql, ['id' => $id]);
}
?>
