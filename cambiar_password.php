<?php
include "verificar_sesion.php";
include "conexion.php";
if($_SESSION["tipo"] != "admin"){
    exit("error");
}
if(
    !isset($_POST["usuario"]) ||
    !isset($_POST["password"])
){
    exit("error");
}
$usuario = trim($_POST["usuario"]);
$password = trim($_POST["password"]);
if($usuario == "" || $password == ""){
    exit("error");
}
if(strlen($password) < 8){
    exit("password_corta");
}
$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$sql = "UPDATE empleados
SET password = ?
WHERE usuario = ?";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "ss",
    $passwordHash,
    $usuario
);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);

?>