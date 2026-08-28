<?php
include "verificar_sesion.php";
include "conexion.php";
if(
    !isset($_POST["nombre"]) ||
    !isset($_POST["categoria"])
){
    exit("error");
}
$nombre = trim($_POST["nombre"]);
$categoria = trim($_POST["categoria"]);
if($nombre == "" || $categoria == ""){
    exit("error");
}
$consulta = mysqli_query($conexion,
"SELECT MAX(id) AS ultimo FROM activos");
$fila = mysqli_fetch_assoc($consulta);
$numero = $fila["ultimo"] + 1;
$codigo = "ACT-" . str_pad($numero, 5, "0", STR_PAD_LEFT);
$sql = "INSERT INTO activos
(codigo_qr,nombre,categoria,activo)
VALUES(?, ?, ?, 1)";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "sss",
    $codigo,
    $nombre,
    $categoria
);
if(mysqli_stmt_execute($stmt)){
    echo $codigo;
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>