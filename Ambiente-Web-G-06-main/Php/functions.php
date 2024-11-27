<?php
// functions.php

// Función para ejecutar una consulta SQL sin retorno (INSERT, UPDATE, DELETE)
function ejecutarConsulta($sql, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return true;
    } catch (PDOException $e) {
        echo "Error en la consulta: " . $e->getMessage();
        return false;
    }
}

// Función para obtener registros de la base de datos
function obtenerRegistros($sql, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // Devuelve todos los registros
    } catch (PDOException $e) {
        echo "Error en la consulta: " . $e->getMessage();
        return [];
    }
}

// Función para obtener un solo registro
function obtenerRegistro($sql, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC); // Devuelve un solo registro
    } catch (PDOException $e) {
        echo "Error en la consulta: " . $e->getMessage();
        return null;
    }
}
?>
