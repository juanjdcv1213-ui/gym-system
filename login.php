<?php
session_start();
include "conexion.php";
$usuario = trim($_POST["usuario"]);
$password = $_POST["password"];
$sql = "SELECT * FROM empleados WHERE usuario = ?";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "s", $usuario);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);
if(mysqli_num_rows($resultado) > 0){
    $datos = mysqli_fetch_assoc($resultado);
    if(password_verify($password, $datos["password"])){
        session_regenerate_id(true);
        $_SESSION["usuario"] = $datos["usuario"];
        $_SESSION["tipo"] = $datos["tipo"];
        echo $datos["tipo"];
    }else{
        echo "error";
    }
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>