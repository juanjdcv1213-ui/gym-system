<?php
include "conexion.php";
if(
    !isset($_POST["bicicleta"]) ||
    !isset($_POST["cliente"]) ||
    !isset($_POST["telefono"])
){
    exit("error");
}
$bicicleta = $_POST["bicicleta"];
$cliente = trim($_POST["cliente"]);
$telefono = trim($_POST["telefono"]);
$fecha = date("Y-m-d");
if($bicicleta == "" || $cliente == "" || $telefono == ""){
    exit("error");
}
$sql = "INSERT INTO spinning
(bicicleta, cliente, telefono, fecha)
VALUES(?, ?, ?, ?)";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "isss",
    $bicicleta,
    $cliente,
    $telefono,
    $fecha
);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>