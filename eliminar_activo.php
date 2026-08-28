<?php
include "verificar_sesion.php";
include "conexion.php";
if($_SESSION["tipo"] != "admin"){
    exit("error");
}
if(!isset($_POST["id"])){
    exit("error");
}
$id = $_POST["id"];
$sql = "DELETE FROM activos WHERE id = ?";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
if(mysqli_stmt_execute($stmt)){
    echo "ok";
}else{
    echo "error";
}
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>