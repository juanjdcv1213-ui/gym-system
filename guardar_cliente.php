<?php
include "verificar_sesion.php";
include "conexion.php";
if(
    !isset($_POST["nombre"]) ||
    !isset($_POST["telefono"]) ||
    !isset($_POST["fecha"])
){
    exit("error");
}
$nombre = trim($_POST["nombre"]);
$telefono = trim($_POST["telefono"]);
$fecha = $_POST["fecha"];
if($nombre == "" || $telefono == "" || $fecha == ""){
    exit("error");
}
$sql = "INSERT INTO clientes(nombre, telefono, fecha)
VALUES(?, ?, ?)";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "sss", $nombre, $telefono, $fecha);
if(mysqli_stmt_execute($stmt)){
    $id = mysqli_insert_id($conexion);
    $codigo = "SW-" . str_pad($id, 6, "0", STR_PAD_LEFT);
    $sql = "UPDATE clientes
            SET codigo_cliente = ?
            WHERE id = ?";
    $stmt2 = mysqli_prepare($conexion, $sql);
    mysqli_stmt_bind_param($stmt2, "si", $codigo, $id);
    mysqli_stmt_execute($stmt2);
    mysqli_stmt_close($stmt2);
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>