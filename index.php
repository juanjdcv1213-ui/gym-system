<?php
session_start();
if(isset($_SESSION["usuario"]) && isset($_SESSION["tipo"])){
    if($_SESSION["tipo"] == "admin"){
        header("Location: admin/dashboard.php");
        exit();
    }
    if($_SESSION["tipo"] == "empleado"){
        header("Location: empleado/dashboard.php");
        exit();
    }
    if($_SESSION["tipo"] == "cliente"){
        header("Location: cliente/cliente.php");
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">
<title>SPORTS WORLD</title>
<link rel="stylesheet" href="index.css">
</head>
<body>
<div class="login">
    <h1>SPORTS WORLD</h1>
    <input type="text"
    id="usuario"
    placeholder="Usuario">
    <input type="password"
    id="password"
    placeholder="Contraseña">
    <button onclick="login()">
        INGRESAR
    </button>
    <a href="cliente/cliente.php"
    class="btn-cliente">
        RESERVAR
    </a>
</div>
<script src="index.js"></script>
</body>
</html>