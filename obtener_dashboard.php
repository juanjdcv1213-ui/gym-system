<?php
include "verificar_sesion.php";
include "conexion.php";
$hoy = date("Y-m-d");
$inicioSemana = date("Y-m-d", strtotime("monday this week"));
$finSemana = date("Y-m-d", strtotime("sunday this week"));
$inicioMes = date("Y-m-01");
$finMes = date("Y-m-t");
$totalClientes = mysqli_fetch_assoc(
    mysqli_query(
        $conexion,
        "SELECT COUNT(*) AS total FROM clientes"
    )
);
$ingresosTotales = mysqli_fetch_assoc(
    mysqli_query(
        $conexion,
        "SELECT IFNULL(SUM(total),0) AS total FROM pagos"
    )
);
$ingresosMes = mysqli_fetch_assoc(
    mysqli_query(
        $conexion,
        "SELECT IFNULL(SUM(total),0) AS total
         FROM pagos
         WHERE fecha BETWEEN '$inicioMes' AND '$finMes'"
    )
);
$ingresosSemana = mysqli_fetch_assoc(
    mysqli_query(
        $conexion,
        "SELECT IFNULL(SUM(total),0) AS total
         FROM pagos
         WHERE fecha BETWEEN '$inicioSemana' AND '$finSemana'"
    )
);
$ingresosHoy = mysqli_fetch_assoc(
    mysqli_query(
        $conexion,
        "SELECT IFNULL(SUM(total),0) AS total
         FROM pagos
         WHERE fecha='$hoy'"
    )
);
echo json_encode([
    "clientes" => $totalClientes["total"],
    "total" => $ingresosTotales["total"],
    "mes" => $ingresosMes["total"],
    "semana" => $ingresosSemana["total"],
    "hoy" => $ingresosHoy["total"]
]);
mysqli_close($conexion);
?>