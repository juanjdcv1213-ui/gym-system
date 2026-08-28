<?php
include "verificar_sesion.php";
include "conexion.php";
if($_SESSION["tipo"] != "admin"){
    exit("error");
}
$carpeta = "backups/";
if(!file_exists($carpeta)){
    mkdir($carpeta, 0755, true);
}
$archivo = $carpeta . "backup_" . date("Y-m") . ".sql";
if(file_exists($archivo)){
    echo "existe";
    mysqli_close($conexion);
    exit();
}
$tablas = array();
$resultado = mysqli_query($conexion, "SHOW TABLES");
while($fila = mysqli_fetch_row($resultado)){
    $tablas[] = $fila[0];
}
$salida = "";
foreach($tablas as $tabla){
    $crear = mysqli_fetch_row(
        mysqli_query($conexion, "SHOW CREATE TABLE `$tabla`")
    );
    $salida .= "\n\n";
    $salida .= "DROP TABLE IF EXISTS `$tabla`;\n";
    $salida .= $crear[1] . ";\n\n";
    $datos = mysqli_query($conexion, "SELECT * FROM `$tabla`");
    while($row = mysqli_fetch_assoc($datos)){
        $columnas = array_keys($row);
        $valores = array();
        foreach($row as $valor){
            if(is_null($valor)){
                $valores[] = "NULL";
            }else{
                $valores[] = "'" .
                mysqli_real_escape_string($conexion, $valor)
                . "'";
            }
        }
        $salida .= "INSERT INTO `$tabla` (`"
        . implode("`,`", $columnas)
        . "`) VALUES ("
        . implode(",", $valores)
        . ");\n";
    }
}
if(file_put_contents($archivo, $salida)){
    echo "ok";
}else{
    echo "error";
}
mysqli_close($conexion);
?>