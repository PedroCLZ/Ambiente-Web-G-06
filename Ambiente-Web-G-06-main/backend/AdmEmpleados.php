<?php

require 'db.php';

function crearEmpleado($user_id, $nombreEmpleado, $direccion, $contacto,$email,$puesto,$horario)
{
    global $pdo;
    try {
        $sql = "INSERT INTO empleados (user_id, nombreEmpleado, direccion, contacto,email,puesto,horario) values (:user_id, :nombreEmpleado, :direccion, :contacto,:email,:puesto,:horario)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'nombreEmpleado' => $nombreEmpleado,
            'direccion' => $direccion,
            'contacto' => $contacto,
            'email' => $email,
            'puesto' => $puesto,
            'horario' => $horario
        ]);
        //devuelve el id de la tarea creada en la linea anterior
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        logError("Error creando empleado: " . $e->getMessage());
        return 0;
    }
}

function editarEmpleado($idEmpleado, $nombreEmpleado, $direccion, $contacto,$email,$puesto,$horario)
{
    global $pdo;
    try {
        $sql = "UPDATE empleados set nombreEmpleado = :nombreEmpleado, direccion = :direccion, contacto = :contacto, email = :email, puesto = :puesto, horario = :horario where idEmpleado = :idEmpleado";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nombreEmpleado' => $nombreEmpleado,
            'direccion' => $direccion,
            'contacto' => $contacto,
            'email' => $email,
            'puesto' => $puesto,
            'horario' => $horario,
            'idEmpleado' => $idEmpleado
        ]);
        $affectedRows = $stmt -> rowCount();
        return $affectedRows > 0;
    } catch (Exception $e) {
        logError($e->getMessage());
        return false;
    }
}

//obtenerEmpleadoPorUsuario
function obtenerEmpleados($user_id)
{
    global $pdo;
    try {
        $sql = "Select * from empleados where user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error al obtener empleados: " . $e->getMessage());
        return [];
    }
}

//Eliminar empleados por id de usuario
function eliminarEmpleado($idEmpleado)
{
    global $pdo;
    try {
        $sql = "delete from empleados where idEmpleado = :idEmpleado";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['idEmpleado' => $idEmpleado]);
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
            $employees = obtenerEmpleados($user_id);
            echo json_encode($employees);
            break;

        case 'POST':
            $input = getJsonInput();
            if (isset($input['nombreEmpleado'], $input['direccion'], $input['contacto'], $input['email'], $input['puesto'], $input['horario'])) {
                //vamos a crear tarea
                $id = crearEmpleado($user_id, $input['nombreEmpleado'], $input['direccion'], $input['contacto'], $input['email'], $input['puesto'], $input['horario']);
                if ($id > 0) {
                    http_response_code(201);
                    echo json_encode(value: ["messsage" => "Empleado creado: ID:" . $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error general creando empleado"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT'://Editar
            $input = getJsonInput();
            if (isset($input['nombreEmpleado'], $input['direccion'], $input['contacto'], $input['email'], $input['puesto'], $input['horario']) && $_GET['idEmpleado']) {
                $editResult = editarEmpleado($_GET['idEmpleado'], $input['nombreEmpleado'], $input['direccion'], $input['contacto'], $input['email'], $input['puesto'], $input['horario']);
                if ($editResult) {
                    http_response_code(201);
                    echo json_encode(['message' => "Empleado actualizado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error actualizando empleado"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'DELETE'://Eliminar
            if ($_GET['idEmpleado']) {
                $fueEliminado = eliminarEmpleado($_GET['idEmpleado']);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => "Empleado eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['message' => 'Sucedio un error al eliminar el empleado']);
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

