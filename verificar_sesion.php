<?php
session_start();
if(!isset($_SESSION["usuario"]) || !isset($_SESSION["tipo"])){
    header("Location: /gym-system/index.php");
    exit();
}
$carpeta = basename(dirname($_SERVER["PHP_SELF"]));
if($carpeta == "admin" && $_SESSION["tipo"] != "admin"){
    header("Location: /gym-system/index.php");
    exit();
}
if($carpeta == "empleado" && $_SESSION["tipo"] != "empleado"){
    header("Location: /gym-system/index.php");
    exit();
}
?>