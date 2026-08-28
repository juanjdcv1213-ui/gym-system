<?php
include "verificar_sesion.php";
include "conexion.php";
$sql = "SELECT *
FROM productos
ORDER BY activo DESC,tipo,nombre";
$resultado = mysqli_query($conexion,$sql);
$productos = [];
while($fila = mysqli_fetch_assoc($resultado)){
    $productos[] = $fila;
}
echo json_encode($productos);
mysqli_close($conexion);
?>