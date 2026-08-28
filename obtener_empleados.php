<?php
include "verificar_sesion.php";
include "conexion.php";
$resultado = mysqli_query(
    $conexion,
    "SELECT usuario FROM empleados ORDER BY usuario"
);
$empleados = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $empleados[] = $fila;
}
echo json_encode($empleados);
mysqli_close($conexion);
?>