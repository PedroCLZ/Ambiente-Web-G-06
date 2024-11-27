<?php
// db.php
$host = 'localhost';  // Cambiar según tu servidor
$dbname = 'cafeteria'; // Nombre de la base de datos
$username = 'root';    // Nombre de usuario
$password = '';        // Contraseña (si no tiene, déjalo vacío)

try {
    // Crear conexión con PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Configurar el modo de error de PDO para excepciones
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En caso de error, muestra el mensaje de error
    echo "Error de conexión: " . $e->getMessage();
    die(); // Terminar el script en caso de error
}
?>