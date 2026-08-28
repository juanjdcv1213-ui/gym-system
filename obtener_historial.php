<?php
include "verificar_sesion.php";
include "conexion.php";
$sql = "
SELECT
    fecha,
    turno,
    empleado,
    COUNT(*) AS revisados
FROM revisiones_activos
GROUP BY fecha, turno, empleado
ORDER BY fecha DESC, hora DESC
";
$resultado = mysqli_query($conexion, $sql);
$datos = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $datos[] = $fila;
}
echo json_encode($datos);
mysqli_close($conexion);
?>