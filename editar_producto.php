<?php
include "verificar_sesion.php";
include "conexion.php";
if($_SESSION["tipo"] != "admin"){
    exit("error");
}
if(
    !isset($_POST["id"]) ||
    !isset($_POST["nombre"]) ||
    !isset($_POST["tipo"]) ||
    !isset($_POST["precio"])
){
    exit("error");
}
$id = intval($_POST["id"]);
$nombre = trim($_POST["nombre"]);
$tipo = trim($_POST["tipo"]);
$precio = floatval($_POST["precio"]);
if($id <= 0 || $nombre == "" || $tipo == "" || $precio <= 0){
    exit("error");
}
$consulta = mysqli_prepare(
    $conexion,
    "SELECT id FROM productos
    WHERE nombre=? AND id<>?"
);
mysqli_stmt_bind_param(
    $consulta,
    "si",
    $nombre,
    $id
);
mysqli_stmt_execute($consulta);
mysqli_stmt_store_result($consulta);

if(mysqli_stmt_num_rows($consulta)>0){
    mysqli_stmt_close($consulta);
    mysqli_close($conexion);
    exit("existe");
}
mysqli_stmt_close($consulta);
$sql = "UPDATE productos
SET nombre=?,
tipo=?,
precio=?
WHERE id=?";
$stmt = mysqli_prepare($conexion,$sql);
mysqli_stmt_bind_param(
    $stmt,
    "ssdi",
    $nombre,
    $tipo,
    $precio,
    $id
);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>