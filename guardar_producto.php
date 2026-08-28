<?php
include "verificar_sesion.php";
include "conexion.php";
if($_SESSION["tipo"] != "admin"){
    exit("error");
}
if(
    !isset($_POST["nombre"]) ||
    !isset($_POST["tipo"]) ||
    !isset($_POST["precio"])
){
    exit("error");
}
$nombre = trim($_POST["nombre"]);
$tipo = trim($_POST["tipo"]);
$precio = floatval($_POST["precio"]);
if($nombre == "" || $tipo == "" || $precio <= 0){
    exit("error");
}
$consulta = mysqli_prepare(
    $conexion,
    "SELECT id FROM productos WHERE nombre=?"
);
mysqli_stmt_bind_param(
    $consulta,
    "s",
    $nombre
);
mysqli_stmt_execute($consulta);
mysqli_stmt_store_result($consulta);
if(mysqli_stmt_num_rows($consulta)>0){
    mysqli_stmt_close($consulta);
    mysqli_close($conexion);
    exit("existe");
}
mysqli_stmt_close($consulta);
$sql = "INSERT INTO productos(nombre,tipo,precio)
VALUES(?,?,?)";
$stmt = mysqli_prepare($conexion,$sql);
mysqli_stmt_bind_param(
    $stmt,
    "ssd",
    $nombre,
    $tipo,
    $precio
);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);