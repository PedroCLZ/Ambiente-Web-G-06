<?php

include('db.php');

// Función para obtener los datos del usuario
function obtenerUsuario($id)
{
    global $pdo;
    try {
        $sql = "SELECT id, username, email  FROM users WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC); // Usamos fetch para devolver un solo usuario
    } catch (Exception $e) {
        error_log("Error al obtener usuario: " . $e->getMessage());
        return null; // Retorna null si ocurre un error
    }
}

session_start();

// Después de verificar las credenciales del usuario en el inicio de sesión
if ($credencialesValidas) {
    $_SESSION['id'] = $usuario['id']; // Aquí se almacena el ID del usuario
    // Redirecciona o responde con éxito
} else {
    echo "Credenciales incorrectas";
}
header('Content-Type: application/json');

// Verificamos si hay un usuario en sesión
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    $user = obtenerUsuario($id);

    if ($user) {
        echo json_encode($user); // Enviamos el usuario como JSON
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Usuario no encontrado"]);
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}
