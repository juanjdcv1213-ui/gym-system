<?php
include "verificar_sesion.php";
include "conexion.php";
$sql = "SELECT * FROM visitas
ORDER BY id DESC";
$resultado = mysqli_query($conexion, $sql);
$visitas = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $visitas[] = $fila;
}
echo json_encode($visitas);
mysqli_close($conexion);
?>