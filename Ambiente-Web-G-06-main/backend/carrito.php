<?php
session_start();
include 'db.php';  // Asegúrate de tener la conexión a la base de datos

// Inicializamos el carrito si no existe
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Función para agregar productos al carrito
if (isset($_POST['action']) && $_POST['action'] == 'add') {
    $productName = $_POST['productName'];
    $price = $_POST['price'];

    // Agregar el producto al carrito (si ya existe, incrementamos la cantidad)
    $found = false;
    foreach ($_SESSION['cart'] as &$item) {
        if ($item['name'] === $productName) {
            $item['quantity'] += 1;
            $item['total'] += $price;
            $found = true;
            break;
        }
    }

    // Si no se encuentra, agregamos un nuevo producto al carrito
    if (!$found) {
        $_SESSION['cart'][] = [
            'name' => $productName,
            'price' => $price,
            'quantity' => 1,
            'total' => $price
        ];
    }

    echo json_encode($_SESSION['cart']); // Enviar carrito actualizado
    exit();
}

// Función para eliminar productos del carrito
if (isset($_POST['action']) && $_POST['action'] == 'remove') {
    $index = $_POST['index'];

    // Eliminar el producto seleccionado
    array_splice($_SESSION['cart'], $index, 1);

    echo json_encode($_SESSION['cart']); // Enviar carrito actualizado
    exit();
}

// Función para obtener el carrito actualizado
if (isset($_POST['action']) && $_POST['action'] == 'get') {
    echo json_encode($_SESSION['cart']); // Devolver carrito actualizado
    exit();
}
?>
