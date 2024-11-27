<?php
session_start();
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Verificar si el email existe en la base de datos
    $query = "SELECT * FROM empleados WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $email); // "s" significa que esperamos una cadena
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verificar si la contraseña es correcta
        if (password_verify($password, $user['password'])) {
            // Iniciar sesión y almacenar la información del usuario
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            echo json_encode(['success' => true, 'message' => 'Login exitoso']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Email no registrado']);
    }
}
?>
