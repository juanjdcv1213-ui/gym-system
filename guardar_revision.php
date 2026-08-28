<?php
include "verificar_sesion.php";
include "conexion.php";
if(
    !isset($_POST["codigo"]) ||
    !isset($_POST["turno"])
){
    exit(json_encode([
        "estado" => "error"
    ]));
}
$codigo = trim($_POST["codigo"]);
$turno = trim($_POST["turno"]);
$empleado = $_SESSION["usuario"];
$sql = "SELECT * FROM activos
WHERE codigo_qr = ?
AND activo = 1";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "s", $codigo);
mysqli_stmt_execute($stmt);
$consulta = mysqli_stmt_get_result($stmt);
if(mysqli_num_rows($consulta) == 0){
    echo json_encode([
        "estado" => "no_existe"
    ]);
    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
    exit();
}
$activo = mysqli_fetch_assoc($consulta);
mysqli_stmt_close($stmt);
$fecha = date("Y-m-d");
$hora = date("H:i:s");
$sql = "SELECT id
FROM revisiones_activos
WHERE codigo_qr = ?
AND fecha = ?
AND turno = ?";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "sss", $codigo, $fecha, $turno);
mysqli_stmt_execute($stmt);
$repetido = mysqli_stmt_get_result($stmt);
if(mysqli_num_rows($repetido) > 0){
    echo json_encode([
        "estado" => "duplicado",
        "nombre" => $activo["nombre"],
        "turno" => $turno
    ]);
    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
    exit();
}
mysqli_stmt_close($stmt);
$sql = "INSERT INTO revisiones_activos
(codigo_qr, turno, fecha, hora, empleado)
VALUES (?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "sssss",
    $codigo,
    $turno,
    $fecha,
    $hora,
    $empleado
);
mysqli_stmt_execute($stmt);
echo json_encode([
    "estado" => "ok",
    "nombre" => $activo["nombre"],
    "categoria" => $activo["categoria"],
    "codigo" => $codigo,
    "turno" => $turno,
    "fecha" => $fecha,
    "hora" => $hora
]);
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>