iniciarSistema();
setInterval(cargarDashboard,5000);
let productoEditando = 0;

function iniciarSistema(){
    mostrarClientes();
    mostrarDashboard();
    mostrarPagos();
    mostrarVisitas();
    mostrarActivos();
    cargarDashboard();
}

function mostrarFormulario(){
    let form =
    document.getElementById("formulario");
    if(form.style.display == "flex"){
        form.style.display = "none";
    }
    else{
        form.style.display = "flex";
    }
}

function agregarCliente(){
    let nombre =
    document.getElementById("nombre").value;
    let telefono =
    document.getElementById("telefono").value;
    let fecha =
    document.getElementById("fecha").value;
    if(nombre.trim()=="" || telefono.trim()=="" || fecha==""){
    mostrarNotificacion(
        "Completa todos los campos",
        "warning"
    );
    return;
    }
    let datos =
    new FormData();
    datos.append("nombre", nombre);
    datos.append("telefono", telefono);
    datos.append("fecha", fecha);
    fetch("../guardar_cliente.php", {
        method:"POST",
        body:datos
    })
    .then(res => res.text())
    .then(respuesta => {
    if(respuesta=="ok"){
            mostrarNotificacion(
            "Cliente registrado correctamente",
            "success"
            );
            document.getElementById("nombre").value = "";
            document.getElementById("telefono").value = "";
            document.getElementById("fecha").value = "";
            mostrarClientes();
            mostrarDashboard();
        }
        else{
            mostrarNotificacion(
            "No se pudo guardar el cliente",
            "error");
        }
    });
}

function mostrarClientes(){
    fetch("../obtener_clientes.php")
    .then(res => res.json())
    .then(clientes => {
        let lista =
        document.getElementById("lista-clientes");
        lista.innerHTML = "";
        clientes.forEach(cliente => {
            let hoy = new Date();
            let vencimiento =
            new Date(cliente.fecha);
            let diferencia =
            vencimiento - hoy;
            let dias =
            diferencia / (1000 * 60 * 60 * 24);
            let color = "";
            if(dias > 7){
                color = "green";
            }else if(dias > 0){
                color = "gold";
            }else{
                color = "red";
            }
            let div =
            document.createElement("div");
            div.classList.add("cliente-item");
            div.style.background = color;
            div.innerHTML =
            "<strong>" + cliente.nombre + "</strong><br>" +
            "" + cliente.telefono + "<br>" +

            "ID" + cliente.codigo_cliente + "<br>" +
            "Vence: " + cliente.fecha + "<br><br>" +
            "<button onclick='mostrarRenovar(" + cliente.id + ",\"" + cliente.nombre + "\")'>Renovar</button> "
            +
            "<button onclick='registrarVisita(\"" + cliente.nombre + "\")'>Entrada</button> "
            +
            "<button onclick='verQRCliente(\"" + cliente.codigo_cliente + "\",\"" + cliente.nombre + "\")'>Ver QR</button>"
            +
            "<div id='renovar-" + cliente.id + "' class='renovar-form'></div>";
            lista.appendChild(div);
        });
    });
}

function registrarPago(){
    const select =
    document.getElementById("producto_pago");
    const producto =
    select.value;
    const cantidad =
    parseInt(document.getElementById("cantidad").value) || 1;
    if(producto === ""){
        mostrarNotificacion(
            "Selecciona un producto",
            "warning"
        );
        return;
    }
    const opcion =
    select.options[select.selectedIndex];
    const precio =
    parseFloat(opcion.dataset.precio);
    const total =
    (precio * cantidad).toFixed(2);
    const datos =
    new FormData();
    datos.append("producto_id", producto);
    datos.append("cantidad", cantidad);
    datos.append("precio_unitario", precio);
    datos.append("total", total);
    fetch("../guardar_pago.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()==="ok"){
            mostrarNotificacion(
                "Venta registrada correctamente",
                "success"
            );
            select.value="";
            document.getElementById("cantidad").value=1;
            document.getElementById("texto_total").textContent="$0.00";
            mostrarPagos();
            mostrarDashboard();
        }else{
            mostrarNotificacion(
                "No fue posible registrar la venta",
                "error"
            );
        }
    })
    .catch(()=>{
        mostrarNotificacion(
            "Error de conexión",
            "error"
        );
    });
}

function mostrarPagos(){
    fetch("../obtener_pagos.php")
    .then(res=>res.json())
    .then(pagos=>{
        let lista=
        document.getElementById("lista-pagos");
        lista.innerHTML="";
        if(pagos.length===0){
            lista.innerHTML=
            "<p>No hay ventas registradas.</p>";
            return;
        }
        pagos.forEach(pago=>{
            let div=
            document.createElement("div");
            div.classList.add("pago-item");
            div.innerHTML=
            "<h3>"+pago.producto+"</h3>"+
            "<p><strong>Cantidad:</strong> "+pago.cantidad+"</p>"+
            "<p><strong>Precio Unitario:</strong> $"+Number(pago.precio_unitario).toFixed(2)+"</p>"+
            "<p><strong>Total:</strong> $"+Number(pago.total).toFixed(2)+"</p>"+
            "<p><strong>Empleado:</strong> "+pago.empleado+"</p>"+
            "<p><strong>Fecha:</strong> "+pago.fecha+"</p>"+
            "<p><strong>Hora:</strong> "+pago.hora+"</p>";
            lista.appendChild(div);
        });
    })
    .catch(()=>{
        document.getElementById("lista-pagos").innerHTML=
        "<p>Error al cargar las ventas.</p>";
    });
}

function mostrarSeccion(id){
    let secciones=
    document.querySelectorAll(".seccion");
    secciones.forEach(sec=>{
        sec.style.display="none";
    });
    document.getElementById(id).style.display=
    "block";
    switch(id){
        case "productos":
            mostrarProductos();
        break;
        case "pagos":
            cargarProductosPago();
            mostrarPagos();
        break;
        case "password":
            cargarUsuarios();
        break;
        case "inventario":
            mostrarActivos();
        break;
    }
}

function mostrarDashboard(){
    fetch("../obtener_dashboard.php")
    .then(res=>res.json())
    .then(data=>{
        document.getElementById("total-clientes").textContent=
        data.clientes;
        document.getElementById("ingresos-totales").textContent=
        "$"+Number(data.total).toFixed(2);
        document.getElementById("ingresos-mes").textContent=
        "$"+Number(data.mes).toFixed(2);
        document.getElementById("ingresos-semana").textContent=
        "$"+Number(data.semana).toFixed(2);
        document.getElementById("ingresos-hoy").textContent=
        "$"+Number(data.hoy).toFixed(2);
    });
}

function buscarClientes(){
    let input=
    document.getElementById("buscador")
    .value
    .toLowerCase()
    .trim();
    let clientes=
    document.querySelectorAll(".cliente-item");
    clientes.forEach(cliente=>{
        cliente.style.display=
        cliente.innerText.toLowerCase().includes(input)
        ? "block"
        : "none";
    });
}

function mostrarRenovar(id,nombre){
    let contenedor=
    document.getElementById("renovar-"+id);
    contenedor.innerHTML=
    "<input type='date' id='fecha-"+id+"'>"+
    "<input type='number' id='monto-"+id+"' placeholder='Monto'>"+
    "<button onclick=\"guardarRenovacion("+id+",'"+nombre+"')\">Guardar</button>";
}

function guardarRenovacion(id,nombre){
    let nuevaFecha=
    document.getElementById("fecha-"+id).value;
    let monto=
    document.getElementById("monto-"+id).value;
    if(nuevaFecha==="" || monto===""){
        mostrarNotificacion(
            "Completa todos los campos",
            "warning"
        );
        return;
    }
    let datos=
    new FormData();
    datos.append("id",id);
    datos.append("fecha",nuevaFecha);
    fetch("../renovar_cliente.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()==="ok"){
            let pago=
            new FormData();
            pago.append("cliente",nombre);
            pago.append("monto",monto);
            pago.append(
                "fecha",
                new Date().toISOString().split("T")[0]
            );
            pago.append("empleado","admin");
            fetch("../guardar_pago.php",{
                method:"POST",
                body:pago
            })
            .then(res=>res.text())
            .then(()=>{
                mostrarNotificacion(
                    "Membresía renovada correctamente",
                    "success"
                );
                mostrarClientes();
                mostrarPagos();
                mostrarDashboard();
            });
        }else{
            mostrarNotificacion(
                "Ocurrió un error al renovar la membresía",
                "error"
            );
        }
    });
}

function registrarVisita(nombre){
    let datos=
    new FormData();
    datos.append("cliente",nombre);
    fetch("../guardar_visita.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()==="ok"){
            mostrarNotificacion(
                "Entrada registrada correctamente",
                "success"
            );
            mostrarVisitas();
        }else{
            mostrarNotificacion(
                "Ocurrió un error al registrar la entrada",
                "error"
            );
        }
    });
}

function mostrarVisitas(){
    fetch("../obtener_visitas.php")
    .then(res=>res.json())
    .then(visitas=>{
        let lista=
        document.getElementById("lista-visitas");
        if(!lista){
            return;
        }
        lista.innerHTML="";
        if(visitas.length===0){
            lista.innerHTML=
            "<p>No hay visitas registradas.</p>";
            return;
        }
        visitas.forEach(visita=>{
            let div=
            document.createElement("div");
            div.classList.add("pago-item");
            div.innerHTML=
            "<strong>"+visita.cliente+"</strong><br>"+
            visita.fecha+"<br>"+
            visita.hora;
            lista.appendChild(div);
        });
    });
}

function cambiarMonto(){
    let select=
    document.getElementById("producto_pago");
    let cantidad=
    parseInt(document.getElementById("cantidad").value) || 1;
    let textoTotal=
    document.getElementById("texto_total");
    if(select.value===""){
        textoTotal.textContent="$0.00";
        return;
    }
    let opcion=
    select.options[select.selectedIndex];
    let precio=
    parseFloat(opcion.dataset.precio);
    textoTotal.textContent=
    "$"+(precio*cantidad).toFixed(2);
}

mostrarBicicletas();

function apartarBici(numero){
    let bici=
    document.getElementById("bici-"+numero);
    bici.innerHTML=
    "<h3>Bici "+numero+"</h3>"+
    "<input type='text' id='cliente-"+numero+"' placeholder='Nombre'><br><br>"+
    "<input type='text' id='telefono-"+numero+"' placeholder='Teléfono'><br><br>"+
    "<button onclick='guardarBici("+numero+")'>Guardar</button>";
}

function guardarBici(numero){
    let cliente=
    document.getElementById("cliente-"+numero).value.trim();
    let telefono=
    document.getElementById("telefono-"+numero).value.trim();
    if(cliente==="" || telefono===""){
        mostrarNotificacion(
            "Completa todos los campos",
            "warning"
        );
        return;
    }
    let datos=
    new FormData();
    datos.append("bicicleta",numero);
    datos.append("cliente",cliente);
    datos.append("telefono",telefono);
    fetch("../guardar_bicicleta.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()==="ok"){
            mostrarNotificacion(
                "Bicicleta reservada correctamente",
                "success"
            );
            mostrarBicicletas();
        }else{
            mostrarNotificacion(
                "Ocurrió un error al guardar la reserva",
                "error"
            );
        }
    });
}

function liberarBici(id){
    let datos=
    new FormData();
    datos.append("id",id);
    fetch("../liberar_bicicleta.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()==="ok"){
            mostrarBicicletas();
            mostrarNotificacion(
                "Bicicleta liberada correctamente",
                "success"
            );
        }else{
            mostrarNotificacion(
                "No fue posible liberar la bicicleta",
                "error"
            );
        }
    });
}

function mostrarBicicletas(){
    fetch("../obtener_bicicletas.php")
    .then(res=>res.json())
    .then(bicis=>{
        let lista=
        document.getElementById("lista-bicicletas");
        if(!lista){
            return;
        }
        lista.innerHTML="";
        for(let i=1;i<=26;i++){
            let biciData=
            bicis.find(b=>b.bicicleta==i);
            let div=
            document.createElement("div");
            div.classList.add("bici");
            div.id="bici-"+i;
            if(biciData){
                div.classList.add("ocupada");
                div.innerHTML=
                "<h3>Bici "+i+"</h3>"+
                "<p>"+biciData.cliente+"</p>"+
                "<p>"+biciData.telefono+"</p>"+
                "<button onclick='liberarBici("+biciData.id+")'>Liberar</button>";
            }else{
                div.classList.add("libre");
                div.innerHTML=
                "<h3>Bici "+i+"</h3>"+
                "<button onclick='apartarBici("+i+")'>Apartar</button>";
            }
            lista.appendChild(div);
        }
    });
}

function guardarActivo(){
    let nombre=
    document.getElementById("nombre_activo").value.trim();
    let categoria=
    document.getElementById("categoria_activo").value.trim();
    if(nombre==="" || categoria===""){
        mostrarNotificacion(
            "Completa todos los campos",
            "warning"
        );
        return;
    }
    let datos=
    new FormData();
    datos.append("nombre",nombre);
    datos.append("categoria",categoria);
    fetch("../guardar_activo.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(codigo=>{
        codigo=codigo.trim();
        if(codigo==="error"){
            mostrarNotificacion(
                "Ocurrió un error al registrar el activo",
                "error"
            );
            return;
        }
        mostrarNotificacion(
            "Activo registrado correctamente",
            "success"
        );
        document.getElementById("resultadoQR").innerHTML=
        "<div class='pago-item'>"+
        "<h3>Activo registrado</h3>"+
        "<p><strong>Código generado:</strong> "+codigo+"</p>"+
        "<div id='qrcode'></div><br>"+
        "<button class='btn-pago' onclick='window.print()'>Imprimir QR</button>"+
        "</div>";
        new QRCode(
            document.getElementById("qrcode"),
            {
                text:codigo,
                width:200,
                height:200
            }
        );
        document.getElementById("nombre_activo").value="";
        document.getElementById("categoria_activo").value="";
        mostrarActivos();
    });
}

function mostrarActivos(){
    fetch("../obtener_activos.php")
    .then(res=>res.json())
    .then(activos=>{
        let lista=
        document.getElementById("lista-activos");
        if(!lista){
            return;
        }
        lista.innerHTML="";
        activos.forEach(activo=>{
            let div=
            document.createElement("div");
            div.classList.add("pago-item");
            div.innerHTML=
            "<strong>"+activo.nombre+"</strong><br>"+
            "Código: "+activo.codigo_qr+"<br>"+
            "Categoría: "+activo.categoria+"<br><br>"+
            "<button class='btn-pago' onclick=\"verQR('"+activo.codigo_qr+"','"+activo.nombre+"')\">Ver QR</button> "+
            "<button class='btn-pago' onclick='eliminarActivo("+activo.id+")'>Eliminar</button>";
            lista.appendChild(div);
        });
    });
}

function eliminarActivo(id){
    mostrarConfirmacion("¿Deseas eliminar este activo?",function(){
        let datos=
        new FormData();
        datos.append("id",id);
        fetch("../eliminar_activo.php",{
            method:"POST",
            body:datos
        })
        .then(res=>res.text())
        .then(respuesta=>{
            if(respuesta.trim()==="ok"){
                mostrarNotificacion(
                    "Activo eliminado correctamente",
                    "success"
                );
                mostrarActivos();
            }else{
                mostrarNotificacion(
                    "No se pudo eliminar el activo",
                    "error"
                );
            }
        });
    });
}

function mostrarFaltantes(){
    let turno=
    document.getElementById("turno_faltantes").value;
    fetch("../obtener_faltantes.php?turno="+turno)
    .then(res=>res.json())
    .then(activos=>{
        let lista=
        document.getElementById("lista-faltantes");
        if(!lista){
            return;
        }
        lista.innerHTML="";
        if(activos.length===0){
            lista.innerHTML=
            "<div class='registro-exitoso'>"+
            "<h2>Inventario completo</h2>"+
            "<p>No hay activos faltantes en el turno de <strong>"+turno+"</strong>.</p>"+
            "</div>";
            return;
        }
        activos.forEach(activo=>{
            let div=
            document.createElement("div");
            div.classList.add("pago-item");
            div.innerHTML=
            "<h3>"+activo.nombre+"</h3>"+
            "<p><strong>Categoría:</strong> "+activo.categoria+"</p>"+
            "<p><strong>Código:</strong> "+activo.codigo_qr+"</p>";
            lista.appendChild(div);
        });
    });
}

mostrarHistorial();

function mostrarHistorial(){
    fetch("../obtener_historial.php")
    .then(res=>res.json())
    .then(historial=>{
        let lista=
        document.getElementById("lista-historial");
        if(!lista){
            return;
        }
        lista.innerHTML="";
        historial.forEach(item=>{
            let div=
            document.createElement("div");
            div.classList.add("pago-item");
            div.innerHTML=
            "<h3>"+item.fecha+"</h3>"+
            "<p><strong>Turno:</strong> "+item.turno+"</p>"+
            "<p><strong>Empleado:</strong> "+item.empleado+"</p>"+
            "<p><strong>Activos revisados:</strong> "+item.revisados+"</p>"+
            "<button class='btn-pago' onclick='verDetalle(\""+item.fecha+"\",\""+item.turno+"\")'>Ver detalle</button>";
            lista.appendChild(div);
        });
    });
}

function verDetalle(fecha,turno){
    let contenedor=
    document.getElementById("detalle-revision");
    contenedor.innerHTML=
    "<h2>Cargando revisión...</h2>";
    Promise.all([
        fetch("../obtener_detalle_revision.php?fecha="+fecha+"&turno="+turno)
        .then(res=>res.json()),
        fetch("../obtener_faltantes_revision.php?fecha="+fecha+"&turno="+turno)
        .then(res=>res.json())
    ])
    .then(([revisados,faltantes])=>{
        let html="";
        html+="<div class='registro-exitoso'>";
        html+="<h2>Resumen de la revisión</h2>";
        html+="<p><strong>Fecha:</strong> "+fecha+"</p>";
        html+="<p><strong>Turno:</strong> "+turno+"</p>";
        html+="<p><strong>Revisados:</strong> "+revisados.length+"</p>";
        html+="<p><strong>Faltantes:</strong> "+faltantes.length+"</p>";
        html+="</div><br>";
        html+="<h2>Activos Revisados</h2>";
        if(revisados.length===0){
            html+="<p>No hay activos revisados.</p>";
        }else{
            revisados.forEach(activo=>{
                html+="<div class='pago-item'>"+
                "<h3>"+activo.nombre+"</h3>"+
                "<p><strong>Categoría:</strong> "+activo.categoria+"</p>"+
                "<p><strong>Código:</strong> "+activo.codigo_qr+"</p>"+
                "<p><strong>Hora:</strong> "+activo.hora+"</p>"+
                "</div>";
            });
        }
        html+="<br><h2>Activos Faltantes</h2>";
        if(faltantes.length===0){
            html+="<div class='registro-exitoso'>"+
            "<h3>No hubo activos faltantes.</h3>"+
            "</div>";
        }else{
            faltantes.forEach(activo=>{
                html+="<div class='pago-item'>"+
                "<h3>"+activo.nombre+"</h3>"+
                "<p><strong>Categoría:</strong> "+activo.categoria+"</p>"+
                "<p><strong>Código:</strong> "+activo.codigo_qr+"</p>"+
                "</div>";
            });
        }
        contenedor.innerHTML=html;
    });
}

function verQR(codigo,nombre){
    document.getElementById("modalQR").style.display="flex";
    document.getElementById("nombreQR").textContent=nombre;
    document.getElementById("textoCodigo").textContent=codigo;
    let contenedor=
    document.getElementById("codigoQRVista");
    contenedor.innerHTML="";
    new QRCode(contenedor,{
        text:codigo,
        width:220,
        height:220
    });
}

function cerrarQR(){
    document.getElementById("modalQR").style.display="none";
    document.getElementById("codigoQRVista").innerHTML="";
}

function cargarDashboard(){
    fetch("../obtener_dashboard.php")
    .then(res=>res.json())
    .then(data=>{
        document.getElementById("total-clientes").innerHTML=
        data.clientes;
        document.getElementById("ingresos-totales").innerHTML=
        "$"+parseFloat(data.total).toFixed(2);
        document.getElementById("ingresos-mes").innerHTML=
        "$"+parseFloat(data.mes).toFixed(2);
        document.getElementById("ingresos-semana").innerHTML=
        "$"+parseFloat(data.semana).toFixed(2);
        document.getElementById("ingresos-hoy").innerHTML=
        "$"+parseFloat(data.hoy).toFixed(2);
    });
}

function actualizarFechaHora(){
    let ahora=
    new Date();
    let horas=
    ahora.getHours();
    let saludo=
    "Buenos días";
    if(horas>=13 && horas<19){
        saludo="Buenas tardes";
    }else if(horas>=19){
        saludo="Buenas noches";
    }
    document.getElementById("saludo").innerHTML=
    saludo+", Administrador";
    let dias=[
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado"
    ];
    let meses=[
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];
    document.getElementById("fecha-actual").innerHTML=
    "Hoy es "+
    dias[ahora.getDay()]+" "+
    ahora.getDate()+
    " de "+
    meses[ahora.getMonth()]+
    " de "+
    ahora.getFullYear();
}

actualizarFechaHora();
setInterval(actualizarFechaHora,1000);

function verQRCliente(codigo,nombre){
    document.getElementById("modalQRCliente").style.display="flex";
    document.getElementById("nombreQRCliente").textContent=nombre;
    document.getElementById("textoCodigoCliente").textContent=codigo;
    let contenedor=
    document.getElementById("codigoQRCliente");
    contenedor.innerHTML="";
    new QRCode(contenedor,{
        text:codigo,
        width:220,
        height:220
    });
}

function cerrarQRCliente(){
    document.getElementById("modalQRCliente").style.display="none";
    document.getElementById("codigoQRCliente").innerHTML="";
}

function cerrarSesion(){
    window.location="../logout.php";
}

function cargarUsuarios(){
    fetch("../obtener_empleados.php")
    .then(res=>res.json())
    .then(usuarios=>{
        let select=
        document.getElementById("usuario_password");
        if(!select){
            return;
        }
        select.innerHTML="";
        usuarios.forEach(usuario=>{
            select.innerHTML+=
            "<option value='"+usuario.usuario+"'>"+
            usuario.usuario+
            "</option>";
        });
    });
}

function mostrarNotificacion(mensaje,tipo="success"){
    let contenedor=
    document.getElementById("notificaciones");
    let notificacion=
    document.createElement("div");
    notificacion.className=
    "notificacion "+tipo;
    let icono="";
    if(tipo=="success"){
        icono="";
    }else if(tipo=="error"){
        icono="";
    }else if(tipo=="warning"){
        icono="";
    }else{
        icono="";
    }
    notificacion.innerHTML=
    icono+mensaje;
    contenedor.appendChild(notificacion);
    setTimeout(function(){
        notificacion.style.opacity="0";
        notificacion.style.transform=
        "translateX(120px)";
        setTimeout(function(){
            notificacion.remove();
        },400);
    },3000);
}

function mostrarConfirmacion(mensaje,accion){
    document.getElementById("mensajeConfirmacion").innerHTML=mensaje;
    document.getElementById("modalConfirmacion").style.display="flex";
    document.getElementById("btnConfirmar").onclick=function(){
        cerrarConfirmacion();
        accion();
    };
}

function cerrarConfirmacion(){
    document.getElementById("modalConfirmacion").style.display="none";
}

function actualizarSistema(){
    mostrarDashboard();
    mostrarClientes();
    mostrarPagos();
    mostrarVisitas();
    mostrarActivos();
    mostrarBicicletas();
}

function guardarProducto(){
    let nombre=
    document.getElementById("nombre_producto").value.trim();
    let tipo=
    document.getElementById("tipo_producto").value;
    let precio=
    document.getElementById("precio_producto").value;
    if(nombre=="" || precio==""){
        mostrarNotificacion(
            "Completa todos los campos",
            "warning"
        );
        return;
    }
    let datos=
    new FormData();
    datos.append("nombre",nombre);
    datos.append("tipo",tipo);
    datos.append("precio",precio);
    let archivo="../guardar_producto.php";
    if(productoEditando!=0){
        datos.append("id",productoEditando);
        archivo="../editar_producto.php";
    }
    fetch(archivo,{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()=="ok"){
            mostrarNotificacion(
                productoEditando==0
                ? "Producto registrado"
                : "Producto actualizado",
                "success"
            );
            document.getElementById("nombre_producto").value="";
            document.getElementById("precio_producto").value="";
            document.getElementById("tipo_producto").value="Servicio";
            productoEditando=0;
            mostrarProductos();
}else if(respuesta.trim()=="existe"){
    mostrarNotificacion(
        "Ese producto ya existe",
        "warning"
    );
}else{
    mostrarNotificacion(
        "Error al guardar",
        "error"
    );
}
    });
}

function mostrarProductos(){
    fetch("../obtener_productos.php")
    .then(res => res.json())
    .then(productos => {
        let lista =
        document.getElementById("lista-productos");
        lista.innerHTML = "";
        productos.forEach(producto => {
            let estado =
            producto.activo == 1
            ? "<span class='estado-activo'>Activo</span>"
            : "<span class='estado-inactivo'>Inactivo</span>";
            let accion =
            producto.activo == 1
            ? "Desactivar"
            : "Activar";
            lista.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.tipo}</td>
                <td>$${parseFloat(producto.precio).toFixed(2)}</td>
                <td>${estado}</td>
                <td>
                    <button
                    class="btn-editar"
                    onclick="editarProducto(
                        ${producto.id},
                        '${producto.nombre}',
                        '${producto.tipo}',
                        '${producto.precio}'
                    )">
                        Editar
                    </button>
                    <button
                    class="btn-eliminar"
                    onclick="desactivarProducto(${producto.id})">
                        ${accion}
                    </button>
                </td>
            </tr>`;
        });
    });
}

function editarProducto(id,nombre,tipo,precio){
    productoEditando = id;
    document.getElementById("nombre_producto").value = nombre;
    document.getElementById("tipo_producto").value = tipo;
    document.getElementById("precio_producto").value = precio;
    document.getElementById("nombre_producto").focus();
    mostrarNotificacion(
        "Editando producto",
        "info"
    );
}

function desactivarProducto(id){
    let mensaje = confirm(
        "¿Deseas cambiar el estado de este producto?"
    );
    if(!mensaje){
        return;
    }
    let datos = new FormData();
    datos.append("id",id);
    fetch("../desactivar_producto.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()=="ok"){
            mostrarNotificacion(
                "Estado actualizado",
                "success"
            );
            mostrarProductos();
        }else{
            mostrarNotificacion(
                "No se pudo actualizar",
                "error"
            );
        }
    });
}

function buscarProductos(){
    let texto =
    document.getElementById("buscar_producto")
    .value
    .toLowerCase();
    let filas =
    document.querySelectorAll("#lista-productos tr");
    filas.forEach(fila=>{
        let contenido =
        fila.innerText.toLowerCase();
        if(contenido.includes(texto)){
            fila.style.display = "";
        }else{
            fila.style.display = "none";
        }
    });
}

function cargarProductosPago(){
    fetch("../obtener_productos.php")
    .then(res=>res.json())
    .then(productos=>{
        let select=
        document.getElementById("producto_pago");
        if(!select){
            return;
        }
        select.innerHTML=
        "<option value=''>Selecciona un producto</option>";
        productos.forEach(producto=>{
            if(producto.activo==1){
                select.innerHTML+=`
                <option
                value="${producto.id}"
                data-precio="${producto.precio}">
                    ${producto.nombre}
                    ($${parseFloat(producto.precio).toFixed(2)})
                </option>`;
            }
        });
    });
}

function seleccionarProducto(){
    let select =
    document.getElementById("producto_pago");
    let opcion =
    select.options[select.selectedIndex];
    let precio =
    opcion.dataset.precio || 0;
    document.getElementById("precio").value =
    precio;
    calcularTotal();
}

function calcularTotal(){
    let select =
    document.getElementById("producto_pago");
    let cantidad =
    parseInt(document.getElementById("cantidad").value) || 1;
    let textoTotal =
    document.getElementById("texto_total");
    if(select.value == ""){
        textoTotal.innerHTML = "$0.00";
        return;
    }
    let opcion =
    select.options[select.selectedIndex];
    let precio =
    parseFloat(opcion.dataset.precio);
    textoTotal.innerHTML =
    "$" + (precio * cantidad).toFixed(2);
}
