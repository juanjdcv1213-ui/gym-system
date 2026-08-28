<?php
include "verificar_sesion.php";
include "conexion.php";
if(
    !isset($_POST["id"]) ||
    !isset($_POST["fecha"])
){
    exit("error");
}
$id = $_POST["id"];
$fecha = $_POST["fecha"];
if($id == "" || $fecha == ""){
    exit("error");
}
$sql = "UPDATE clientes
SET fecha = ?
WHERE id = ?";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "si", $fecha, $id);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>