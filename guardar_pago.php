<?php
include "verificar_sesion.php";
include "conexion.php";
if(
    !isset($_POST["producto_id"]) ||
    !isset($_POST["cantidad"]) ||
    !isset($_POST["precio_unitario"]) ||
    !isset($_POST["total"])
){
    exit("error");
}
$producto_id = intval($_POST["producto_id"]);
$cantidad = intval($_POST["cantidad"]);
$precio_unitario = floatval($_POST["precio_unitario"]);
$total = floatval($_POST["total"]);
$empleado = $_SESSION["usuario"];
$fecha = date("Y-m-d");
$hora = date("H:i:s");
$cliente = "";
$monto = $total;
$sql = "INSERT INTO pagos(
producto_id,
cantidad,
precio_unitario,
total,

cliente,
monto,
fecha,
hora,
empleado
)
VALUES(
?,
?,
?,
?,
?,
?,
?,
?,
?
)";
$stmt = mysqli_prepare($conexion,$sql);
mysqli_stmt_bind_param(
$stmt,
"iiddsdsss",
$producto_id,
$cantidad,
$precio_unitario,
$total,

$cliente,
$monto,
$fecha,
$hora,
$empleado
);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>