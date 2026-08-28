<?php
date_default_timezone_set("America/Mexico_City");
$conexion = mysqli_connect(
    "localhost",
    "root",
    "",
    "gym_system"
);
if(!$conexion){
    http_response_code(500);
    exit("Error al conectar con la base de datos.");
}
mysqli_set_charset($conexion, "utf8mb4");
?>