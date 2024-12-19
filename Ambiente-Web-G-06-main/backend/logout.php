<?php
require 'message_log.php';
session_start();
session_unset();
session_destroy();

logDebug("Usuario cerro sesion");
//revisar 
header('Location: /Ambiente-Web-G-06/Ambiente-Web-G-06-main/login.html ');