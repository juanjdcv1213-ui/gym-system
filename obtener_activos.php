<?php
include "verificar_sesion.php";
include "conexion.php";
$sql = "SELECT * FROM activos
ORDER BY nombre ASC";
$resultado = mysqli_query($conexion, $sql);
$datos = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $datos[] = $fila;
}
echo json_encode($datos);
mysqli_close($conexion);
?>