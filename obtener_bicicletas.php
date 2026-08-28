<?php
include "verificar_sesion.php";
include "conexion.php";
mysqli_query(
    $conexion,
    "DELETE FROM spinning
    WHERE fecha < CURDATE()"
);
$sql = "SELECT * FROM spinning";
$resultado = mysqli_query($conexion, $sql);
$bicis = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $bicis[] = $fila;
}
echo json_encode($bicis);
mysqli_close($conexion);
?>