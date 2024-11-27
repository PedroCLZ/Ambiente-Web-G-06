<?php
session_start();
include('db.php');

// Verificar si el usuario está autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión para ver tu perfil']);
    exit;
}

// Obtener la información del usuario desde la base de datos
$query = "SELECT * FROM empleados WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $_SESSION['user_id']); // "i" significa que esperamos un entero
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}
?>
