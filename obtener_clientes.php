<?php
include "verificar_sesion.php";
include "conexion.php";
mysqli_query(
    $conexion,
    "DELETE FROM clientes
    WHERE fecha < DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
);
$sql = "SELECT * FROM clientes
ORDER BY fecha ASC";
$resultado = mysqli_query($conexion, $sql);
$clientes = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $clientes[] = $fila;
}
echo json_encode($clientes);
mysqli_close($conexion);
?>