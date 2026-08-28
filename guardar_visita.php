<?php
include "verificar_sesion.php";
include "conexion.php";
if(!isset($_POST["cliente"])){
    exit("error");
}
$cliente = trim($_POST["cliente"]);
if($cliente == ""){
    exit("error");
}
$fecha = date("Y-m-d");
$hora = date("H:i:s");
$sql = "INSERT INTO visitas(cliente, fecha, hora)
VALUES(?, ?, ?)";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "sss", $cliente, $fecha, $hora);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>