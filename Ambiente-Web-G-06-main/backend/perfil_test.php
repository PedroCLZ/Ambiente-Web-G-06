<?php
session_start();
require 'perfil.php';

echo "Lista de usuario" . PHP_EOL;
$usuarios =  obtenerUsuario($_SESSION ['id']);
if($usuarios){
    foreach($usuarios as $usuario){
        echo "ID: " . $usuario["id"] . " Titulo: " . $usuario["username"] . PHP_EOL;
    }
}