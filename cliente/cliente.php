<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panel Cliente</title>
<link rel="stylesheet" href="../dashboard.css">
</head>
<body>
<div class="sidebar">
    <h2>SPORTS WORLD</h2>
    <ul>
        <li onclick="mostrarSeccion('spinning')">
            Spinning
        </li>
    </ul>
</div>
<div class="main-content">
    <div id="spinning" class="seccion">
        <h1>Spinning</h1>
        <p>
            Selecciona una bicicleta disponible
        </p>
        <div id="lista-bicis" class="grid-bicis"></div>
    </div>
</div>
<div id="notificaciones"></div>
<script src="cliente.js"></script>
</body>
</html>