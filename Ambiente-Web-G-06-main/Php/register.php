<?php
session_start();
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validar si el email ya existe
    $query = "SELECT * FROM empleados WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $email); // "s" significa que esperamos una cadena
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Si el email ya está registrado
        echo json_encode(['success' => false, 'message' => 'El correo electrónico ya está registrado']);
    } else {
        // Si no existe, insertamos el nuevo empleado
        $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Cifra la contraseña
        $query = "INSERT INTO empleados (nombre, email, password) VALUES (?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sss", $name, $email, $hashed_password); // "sss" significa que son 3 cadenas
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error en el registro']);
        }
    }
}
?>