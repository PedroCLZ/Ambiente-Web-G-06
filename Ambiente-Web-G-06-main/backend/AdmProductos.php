<?php

require 'db.php';

function crearProducto($user_id, $nombreProducto, $descripcion, $estado)
{
    global $pdo;
    try {
        $sql = "INSERT INTO productos (user_id, nombreProducto, descripcion, estado) values (:user_id, :nombreProducto, :descripcion, :estado)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'nombreProducto' => $nombreProducto,
            'descripcion' => $descripcion,
            'estado' => $estado
        ]);
        //devuelve el id del producto creada en la linea anterior
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        logError("Error creando empleado: " . $e->getMessage());
        return 0;
    }
}

function editarProducto($idProducto, $nombreProducto, $descripcion, $estado)
{
    global $pdo;
    try {
        $sql = "UPDATE productos set nombreProducto = :nombreProducto, descripcion = :descripcion, estado = :estado where idProducto = :idProducto";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nombreProducto' => $nombreProducto,
            'descripcion' => $descripcion,
            'estado' => $estado,
            'idProducto' => $idProducto,
        ]);
        $affectedRows = $stmt -> rowCount();
        return $affectedRows > 0;
    } catch (Exception $e) {
        logError($e->getMessage());
        return false;
    }
}

//obtenerEmpleadoPorUsuario
function obtenerProductos($user_id)
{
    global $pdo;
    try {
        $sql = "Select * from productos where user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error al obtener empleados: " . $e->getMessage());
        return [];
    }
}

//Eliminar empleados por id de usuario
function eliminarProducto($idProducto)
{
    global $pdo;
    try {
        $sql = "delete from productos where idProducto = :idProducto";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['idProducto' => $idProducto]);
        return $stmt->rowCount() > 0;// true si se elimina algo
    } catch (Exception $e) {
        logError("Error al eliminar empleados: " . $e->getMessage());
        return false;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');
function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

session_start();
if (isset($_SESSION['user_id'])) {
    //el usuario tiene sesion
    $user_id = $_SESSION['user_id'];
    logDebug($user_id);
    switch ($method) {
        case 'GET':
            //devolver las tareas del usuario conectado
            $products = obtenerProductos($user_id);
            echo json_encode($products);
            break;

        case 'POST':
            $input = getJsonInput();
            if (isset($input['nombreProducto'], $input['descripcion'], $input['estado'])) {
                //vamos a crear tarea
                $id = crearProducto($user_id, $input['nombreProducto'], $input['descripcion'], $input['estado']);
                if ($id > 0) {
                    http_response_code(201);
                    echo json_encode(value: ["messsage" => "Producto creado: ID:" . $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error general creando producto"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT'://Editar
            $input = getJsonInput();
            if (isset($input['nombreProducto'], $input['descripcion'], $input['estado']) && $_GET['idProducto']) {
                $editResult = editarProducto($_GET['idProducto'], $input['nombreProducto'], $input['descripcion'], $input['estado']);
                if ($editResult) {
                    http_response_code(201);
                    echo json_encode(['message' => "Producto actualizado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error actualizando producto"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'DELETE'://Eliminar
            if ($_GET['idProducto']) {
                $fueEliminado = eliminarProducto($_GET['idProducto']);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => "Producto eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['message' => 'Sucedio un error al eliminar el producto']);
                }

            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Metodo no permitido"]);
            break;
    }

} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesion no activa"]);
}

