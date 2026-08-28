<?php
include "verificar_sesion.php";
include "conexion.php";
$sql = "SELECT
            pagos.*,
            productos.nombre AS producto
        FROM pagos
        INNER JOIN productos
            ON pagos.producto_id = productos.id
        ORDER BY pagos.id DESC";
$resultado = mysqli_query($conexion, $sql);
$pagos = [];
while($fila = mysqli_fetch_assoc($resultado)){
    $pagos[] = $fila;
}
echo json_encode($pagos);
mysqli_close($conexion);
?>