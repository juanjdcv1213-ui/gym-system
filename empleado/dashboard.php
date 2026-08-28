<?php
include("../verificar_sesion.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panel Empleado</title>
<link rel="stylesheet" href="dashboard.css">
<script src="https://unpkg.com/html5-qrcode"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>
<div class="sidebar">
    <h2>SPORTS WORLD</h2>
    <ul>
        <li onclick="mostrarSeccion('inicio')">
            Inicio
        </li>
        <li onclick="mostrarSeccion('pagos')">
            Pagos
        </li>
        <li onclick="mostrarSeccion('clientes')">
            Clientes
        </li>
        <li onclick="mostrarSeccion('spinning')">
            Spinning
        </li>
        <li onclick="mostrarSeccion('inventario')">
            Inventario
        </li>
    </ul>
</div>
<div class="main-content">
<div class="logout-container">
    <button
    class="btn-logout"
    onclick="cerrarSesion()">
        Cerrar sesión
    </button>
</div>
    <div id="inicio" class="seccion">
            <div class="dashboard-header">
        <div>
            <h1 id="saludo-empleado">
                Bienvenido, Empleado
            </h1>
            <p id="fecha-actual"></p>
        </div>
    </div>
        <div class="card blue">
            <h3>Bienvenido</h3>
            <p>
                Aquí podrás registrar cobros,
                consultar clientes y apartar
                bicicletas de spinning.
            </p>
        </div>
    </div>
    <div id="clientes"
    class="seccion"
    style="display:none;">
        <h1>Clientes</h1>
        <button onclick="mostrarFormulario()"
        class="btn-agregar">
            + Nuevo Cliente
        </button>
        <div id="formulario"
        class="formulario">
            <input type="text"
            id="nombre"
            placeholder="Nombre">
            <input type="text"
            id="telefono"
            placeholder="Teléfono">
            <input type="date"
            id="fecha">
            <button onclick="agregarCliente()">
                Guardar Cliente
            </button>
        </div>
        <input type="text"
        id="buscador"
        placeholder="Buscar cliente"
        onkeyup="buscarClientes()"
        class="buscador">
        <div id="lista-clientes"></div>
    </div>
<div id="pagos"
class="seccion"
style="display:none;">
    <h1>Punto de Venta</h1>
    <div class="formulario-pagos">
        <select
        id="producto_pago"
        onchange="calcularTotal()"
        class="select-pago">
            <option value="">
                Selecciona un producto
            </option>
        </select>
        <input
        type="number"
        id="cantidad"
        value="1"
        min="1"
        onchange="calcularTotal()">
        <div
        id="texto_total"
        class="total-pago">
            $0.00
        </div>
        <button
        onclick="registrarPago()"
        class="btn-pago">
            Registrar Venta
        </button>
    </div>
    <br>
    <h2>Ventas del día</h2>
    <div id="lista-pagos"></div>
</div>
    <div id="spinning"
    class="seccion"
    style="display:none;">
        <h1>Spinning</h1>
        <div id="lista-bicicletas"
        class="grid-bicis"></div>
    </div>
    <div id="inventario"
    class="seccion"
    style="display:none;">
        <h1>Control de Activos</h1>
        <div class="formulario-pagos">
            <button
            onclick="iniciarEscaner()"
            class="btn-pago">
                Escanear QR
            </button>
        </div>
        <br>
        <div id="reader"
        style="
        width:350px;
        max-width:100%;
        margin:auto;">
        </div>
        <br>
        <div id="resultado"></div>
    </div>
</div>
<div id="modalQRCliente"
class="modal-qr"
style="display:none;">
    <div class="credencial">
        <div class="credencial-header">
            <h2>SPORTS WORLD</h2>
            <p>CREDENCIAL DE SOCIO</p>
        </div>
        <div class="credencial-body">
            <h3 id="nombreQRCliente"></h3>
            <p>
                <strong>Código:</strong>
                <span id="textoCodigoCliente"></span>
            </p>
            <p>
                <strong>Vigencia:</strong>
                <span id="vigenciaCliente"></span>
            </p>
            <div id="codigoQRCliente"
            class="qr-centro"></div>
            <div class="estado-activo">
                MEMBRESÍA ACTIVA
            </div>
        </div>
        <div class="credencial-footer">
            <button
            class="btn-pago"
            onclick="window.print()">
                Imprimir Credencial
            </button>
            <button
            class="btn-pago"
            onclick="cerrarQRCliente()">
                Cerrar
            </button>
        </div>
    </div>
</div>
<div id="notificaciones"></div>
<script src="dashboard.js"></script>
</body>
</html>