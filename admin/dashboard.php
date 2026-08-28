<?php
include("../verificar_sesion.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">
<title>Panel Administrador</title>
<link rel="stylesheet" href="dashboard.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>
<div class="sidebar">
    <h2>SPORTS WORLD</h2>
    <ul>
        <li onclick="mostrarSeccion('dashboard')">
            Dashboard
        </li>
        <li onclick="mostrarSeccion('clientes')">
            Clientes
        </li>
        <li onclick="mostrarSeccion('pagos')">
            Pagos
        </li>
        <li onclick="mostrarSeccion('visitas')">
            Visitas
        </li>
        <li onclick="mostrarSeccion('spinning')">
            Spinning
        </li>
        <li onclick="mostrarSeccion('inventario')">
            Inventario
        </li>
        <li onclick="mostrarSeccion('productos')">
            Productos
        </li>
        <li onclick="mostrarSeccion('faltantes')">
            Faltantes
        </li>
        <li onclick="mostrarSeccion('historial')">
            Historial
        </li>
        <li onclick="mostrarSeccion('password')">
            Cambiar contraseña
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
<div id="dashboard"
class="seccion">
    <div class="dashboard-header">
        <div>
            <h1 id="saludo">
                Bienvenido, Administrador
            </h1>
            <p id="fecha-actual"></p>
        </div>
    </div>
    <div class="cards">
        <div class="card">
            <h3>Total Clientes</h3>
            <p id="total-clientes">0</p>
        </div>
        <div class="card blue">
            <h3>Ingresos Totales</h3>
            <p id="ingresos-totales">$0.00</p>
        </div>
        <div class="card green">
            <h3>Ingresos del Mes</h3>
            <p id="ingresos-mes">$0.00</p>
        </div>
        <div class="card orange">
            <h3>Ingresos de la Semana</h3>
            <p id="ingresos-semana">$0.00</p>
        </div>
        <div class="card red">
            <h3>Ingresos de Hoy</h3>
            <p id="ingresos-hoy">$0.00</p>
        </div>
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
        onchange="cambiarMonto()"
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
        <div class="total-box">
            <span>Total</span>
            <h2 id="texto_total">$0.00</h2>
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
<div id="visitas"
class="seccion"
style="display:none;">
    <h1>Visitas</h1>
    <div id="lista-visitas"></div>
</div>
<div id="spinning"
class="seccion"
style="display:none;">
    <h1>Spinning</h1>
    <div
    id="lista-bicicletas"
    class="grid-bicis">
    </div>
</div>
<div id="inventario"
class="seccion"
style="display:none;">
    <h1>Inventario</h1>
    <div class="formulario-pagos">
        <input
        type="text"
        id="codigo_qr"
        placeholder="Código QR">
        <input
        type="text"
        id="nombre_activo"
        placeholder="Nombre">
        <input
        type="text"
        id="categoria"
        placeholder="Categoría">
        <button
        class="btn-pago"
        onclick="registrarActivo()">
            Guardar Activo
        </button>
    </div>
    <br>
    <div id="lista-activos"></div>
</div>
<div id="productos"
class="seccion"
style="display:none;">
    <h1>Productos y Servicios</h1>
    <div class="formulario-productos">
        <input
        type="text"
        id="nombre_producto"
        placeholder="Nombre del producto">

        <select id="tipo_producto">
            <option value="Servicio">
                Servicio
            </option>
            <option value="Producto">
                Producto
            </option>
        </select>
        <input
        type="number"
        id="precio_producto"
        placeholder="Precio">
        <button
        onclick="guardarProducto()"
        class="btn-pago">
            Guardar Producto
        </button>
    </div>
    <div class="busqueda-productos">
        <input
        type="text"
        id="buscar_producto"
        placeholder="Buscar producto..."
        onkeyup="buscarProductos()">
    </div>
    <table class="tabla-productos">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody id="lista-productos">
        </tbody>
    </table>
</div>
<div id="faltantes"
class="seccion"
style="display:none;">
    <h1>Reporte de Faltantes</h1>
    <div class="formulario-pagos">
        <select
        id="turno_faltantes"
        class="select-pago">
            <option value="Apertura">
                Apertura
            </option>
            <option value="Cierre">
                Cierre
            </option>
        </select>
        <button
        class="btn-pago"
        onclick="mostrarFaltantes()">
            Consultar
        </button>
    </div>
    <br>
    <div id="lista-faltantes"></div>
</div>
<div id="historial"
class="seccion"
style="display:none;">
    <h1>Historial de Revisiones</h1>
    <div id="lista-historial"></div>
    <hr>
    <h2>Detalle de la revisión</h2>
    <div id="detalle-revision"></div>
</div>
<div id="password"
class="seccion"
style="display:none;">
    <h1>Cambiar contraseña</h1>
    <div class="formulario-pagos">
        <select
        id="usuario_password"
        class="select-pago">
        </select>
        <input
        type="password"
        id="nueva_password"
        placeholder="Nueva contraseña">
        <input
        type="password"
        id="confirmar_password"
        placeholder="Confirmar contraseña">
        <button
        class="btn-pago"
        onclick="cambiarPassword()">
            Guardar contraseña
        </button>
    </div>
</div>
</div>
<div id="modalQR"
style="
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.6);
justify-content:center;
align-items:center;
z-index:9999;">
    <div style="
    background:white;
    padding:25px;
    border-radius:15px;
    text-align:center;
    width:400px;
    max-width:90%;">
        <h2>SPORTS WORLD</h2>
        <h3 id="nombreQR"></h3>
        <div id="codigoQRVista"
        style="margin:20px auto;"></div>
        <p id="textoCodigo"></p>
        <button
        class="btn-pago"
        onclick="window.print()">
            Imprimir
        </button>
        <button
        class="btn-pago"
        onclick="cerrarQR()">
            Cerrar
        </button>
    </div>
</div>
<div id="modalConfirmacion" class="modal-confirmacion">
    <div class="modal-confirmacion-contenido">
        <h2>Confirmar acción</h2>
        <p id="mensajeConfirmacion"></p>
        <div class="botones-confirmacion">
            <button
            class="btn-cancelar"
            onclick="cerrarConfirmacion()">
                Cancelar
            </button>
            <button
            class="btn-eliminar"
            id="btnConfirmar">
                Eliminar
            </button>
        </div>
    </div>
</div>
<div id="notificaciones"></div>
<script src="dashboard.js"></script>
</body>
</html>