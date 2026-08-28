<?php
include "verificar_sesion.php";
include "conexion.php";
if($_SESSION["tipo"] != "admin"){
    exit("error");
}
if(!isset($_POST["id"])){
    exit("error");
}
$id = intval($_POST["id"]);
if($id <= 0){
    exit("error");
}
$consulta = mysqli_prepare(
    $conexion,
    "SELECT activo
    FROM productos
    WHERE id=?"
);
mysqli_stmt_bind_param(
    $consulta,
    "i",
    $id
);
mysqli_stmt_execute($consulta);
$resultado = mysqli_stmt_get_result($consulta);
if(mysqli_num_rows($resultado)==0){
    echo "error";
    exit();
}
$producto = mysqli_fetch_assoc($resultado);
$nuevoEstado =
($producto["activo"] == 1)
? 0
: 1;
mysqli_stmt_close($consulta);
$actualizar = mysqli_prepare(
    $conexion,
    "UPDATE productos
    SET activo=?
    WHERE id=?"
);
mysqli_stmt_bind_param(
    $actualizar,
    "ii",
    $nuevoEstado,
    $id
);
if(mysqli_stmt_execute($actualizar)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($actualizar);
mysqli_close($conexion);
?>