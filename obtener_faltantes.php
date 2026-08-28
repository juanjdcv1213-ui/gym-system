<?php
include "verificar_sesion.php";
include "conexion.php";
if(!isset($_GET["turno"])){
    exit("error");
}
$fecha = date("Y-m-d");
$turno = trim($_GET["turno"]);
$sql = "
SELECT *
FROM activos
WHERE activo = 1
AND codigo_qr NOT IN (
    SELECT codigo_qr
    FROM revisiones_activos
    WHERE fecha = ?
    AND turno = ?
)
ORDER BY nombre ASC
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