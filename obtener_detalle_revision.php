<?php
include "verificar_sesion.php";
include "conexion.php";
if(
    !isset($_GET["fecha"]) ||
    !isset($_GET["turno"])
){
    exit("error");
}
$fecha = $_GET["fecha"];
$turno = trim($_GET["turno"]);
$sql = "
SELECT
    revisiones_activos.codigo_qr,
    activos.nombre,
    activos.categoria,
    revisiones_activos.hora
FROM revisiones_activos
INNER JOIN activos
ON revisiones_activos.codigo_qr = activos.codigo_qr
WHERE
    revisiones_activos.fecha = ?
AND revisiones_activos.turno = ?
ORDER BY activos.nombre ASC
";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "ss", $fecha, $turno);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);
$datos = array();
while($fila = mysqli_fetch_assoc($resultado)){
    $datos[] = $fila;
}
echo json_encode($datos);
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>