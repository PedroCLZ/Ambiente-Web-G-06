<?php

require 'db.php';

function crearProveedor($user_id, $nombreProveedor, $direccion, $email, $contacto)
{
    global $pdo;
    try {
        $sql = "INSERT INTO proveedores (user_id, nombreProveedor, direccion, email, contacto) values (:user_id, :nombreProveedor, :direccion, :email,:contacto)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'nombreProveedor' => $nombreProveedor,
            'direccion' => $direccion,
            'email' => $email,
            'contacto' => $contacto,
        ]);
        //devuelve el id del proveedor creada en la linea anterior
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        logError("Error creando proveedor: " . $e->getMessage());
        return 0;
    }
}

function editarProveedor($idProveedor, $nombreProveedor, $direccion, $email, $contacto)
{
    global $pdo;
    try {
        $sql = "UPDATE proveedores set nombreProveedor = :nombreProveedor, direccion = :direccion, email = :email, contacto = :contacto where idProveedor = :idProveedor";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nombreProveedor' => $nombreProveedor,
            'direccion' => $direccion,
            'email' => $email,
            'contacto' => $contacto,
            'idProveedor' => $idProveedor,
        ]);
        $affectedRows = $stmt -> rowCount();
        return $affectedRows > 0;
    } catch (Exception $e) {
        logError($e->getMessage());
        return false;
    }
}

//obtenerProveedorPorUsuario
function obtenerProveedores($user_id)
{
    global $pdo;
    try {
        $sql = "Select * from proveedores where user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error al obtener proveedores: " . $e->getMessage());
        return [];
    }
}

//Eliminar proveedors por id de usuario
function eliminarProveedor($idProveedor)
{
    global $pdo;
    try {
        $sql = "delete from proveedores where idProveedor = :idProveedor";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['idProveedor' => $idProveedor]);
        return $stmt->rowCount() > 0;// true si se elimina algo
    } catch (Exception $e) {
        logError("Error al eliminar proveedor: " . $e->getMessage());
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
            $provs = obtenerProveedores($user_id);
            echo json_encode($provs);
            break;

        case 'POST':
            $input = getJsonInput();
            if (isset($input['nombreProveedor'], $input['direccion'], $input['email'],$input['contacto'])) {
                //vamos a crear tarea
                $id = crearProveedor($user_id, $input['nombreProveedor'], $input['direccion'], $input['email'],$input['contacto']);
                if ($id > 0) {
                    http_response_code(201);
                    echo json_encode(value: ["messsage" => "Proveedor creado: ID:" . $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error general creando proveedor"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT'://Editar
            $input = getJsonInput();
            if (isset($input['nombreProveedor'], $input['direccion'], $input['email'],$input['contacto']) && $_GET['idProveedor']) {
                $editResult = editarProveedor($_GET['idProveedor'], $input['nombreProveedor'], $input['direccion'], $input['email'],$input['contacto']);
                if ($editResult) {
                    http_response_code(201);
                    echo json_encode(['message' => "Proveedor actualizado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error actualizando proveedor"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'DELETE'://Eliminar
            if ($_GET['idProveedor']) {
                $fueEliminado = eliminarProveedor($_GET['idProveedor']);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => "Proveedor eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['message' => 'Sucedio un error al eliminar el proveedor']);
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

