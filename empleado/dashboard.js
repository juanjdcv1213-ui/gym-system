iniciarSistema();
function iniciarSistema(){
    mostrarClientes();
    mostrarPagos();
    mostrarBicicletas();
    cargarProductosPago();
}

function mostrarFormulario(){
    let form =
    document.getElementById("formulario");
    if(form.style.display=="flex"){
        form.style.display="none";
    }
    else{
        form.style.display="flex";
    }
}

function agregarCliente(){
    let nombre=
    document.getElementById("nombre").value;
    let telefono=
    document.getElementById("telefono").value;
    let fecha=
    document.getElementById("fecha").value;
    if(nombre.trim()==""||telefono.trim()==""||fecha==""){
        mostrarNotificacion("Completa todos los campos","warning");
        return;
    }
    let datos=
    new FormData();
    datos.append("nombre",nombre);
    datos.append("telefono",telefono);
    datos.append("fecha",fecha);
    fetch("../guardar_cliente.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta=="ok"){
            mostrarNotificacion("Cliente registrado correctamente","success");
            document.getElementById("nombre").value="";
            document.getElementById("telefono").value="";
            document.getElementById("fecha").value="";
            mostrarClientes();
        }
        else{
            mostrarNotificacion("Ocurrió un error al guardar el cliente","error");
        }
    });
}

function mostrarClientes(){
    fetch("../obtener_clientes.php")
    .then(res=>res.json())
    .then(clientes=>{
        let lista=
        document.getElementById("lista-clientes");
        lista.innerHTML="";
        clientes.forEach(cliente=>{
            let hoy=new Date();
            let vencimiento=
            new Date(cliente.fecha);
            let dias=
            (vencimiento-hoy)/(1000*60*60*24);
            let color="";
            if(dias>7){
                color="green";
            }
            else if(dias>0){
                color="gold";
            }
            else{
                color="red";
            }
            let div=
            document.createElement("div");
            div.classList.add("cliente-item");
            div.style.background=color;
            div.innerHTML=
            "<strong>"+cliente.nombre+"</strong><br>"+
            cliente.telefono+"<br>"+
            "ID "+cliente.codigo_cliente+"<br>"+
            "Vence: "+cliente.fecha+"<br><br>"+
            "<button onclick='mostrarRenovar("+cliente.id+",\""+cliente.nombre+"\")'>Renovar</button> "+
            "<button onclick='registrarVisita(\""+cliente.nombre+"\")'>Entrada</button> "+
            "<button onclick='verQRCliente(\""+cliente.codigo_cliente+"\",\""+cliente.nombre+"\",\""+cliente.fecha+"\")'>Credencial</button>"+
            "<div id='renovar-"+cliente.id+"' class='renovar-form'></div>";
            lista.appendChild(div);
        });
    });
}

function registrarPago(){
    let select=
    document.getElementById("producto_pago");
    let producto=
    select.value;
    let cantidad=
    parseInt(document.getElementById("cantidad").value)||1;
    if(producto==""){
        mostrarNotificacion("Selecciona un producto","warning");
        return;
    }
    let opcion=
    select.options[select.selectedIndex];
    let precio=
    parseFloat(opcion.dataset.precio);
    let total=
    (precio*cantidad).toFixed(2);
    let datos=
    new FormData();
    datos.append("producto_id",producto);
    datos.append("cantidad",cantidad);
    datos.append("precio_unitario",precio);
    datos.append("total",total);
    fetch("../guardar_pago.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.text())
    .then(respuesta=>{
        if(respuesta.trim()=="ok"){
            mostrarNotificacion("Venta registrada correctamente","success");
            document.getElementById("producto_pago").value="";
            document.getElementById("cantidad").value=1;
            document.getElementById("texto_total").innerHTML="$0.00";
            mostrarPagos();
            cargarProductosPago();
        }
        else{
            mostrarNotificacion("Ocurrió un error al registrar la venta","error");
        }
    });
}

function mostrarPagos(){
    fetch("../obtener_pagos.php")
    .then(res=>res.json())
    .then(pagos=>{
        let lista=
        document.getElementById("lista-pagos");
        lista.innerHTML="";
        if(pagos.length==0){
            lista.innerHTML="<p>No hay ventas registradas.</p>";
            return;
        }
        pagos.forEach(pago=>{
            let div=
            document.createElement("div");
            div.classList.add("pago-item");
            div.innerHTML=
            "<h3>"+pago.producto+"</h3>"+
            "<p><strong>Cantidad:</strong> "+pago.cantidad+"</p>"+
            "<p><strong>Precio:</strong> $"+parseFloat(pago.precio_unitario).toFixed(2)+"</p>"+
            "<p><strong>Total:</strong> $"+parseFloat(pago.total).toFixed(2)+"</p>"+
            "<p><strong>Empleado:</strong> "+pago.empleado+"</p>"+
            "<p><strong>Fecha:</strong> "+pago.fecha+"</p>"+
            "<p><strong>Hora:</strong> "+pago.hora+"</p>";
            lista.appendChild(div);
        });
    });
}

function mostrarSeccion(id){
    let secciones=
    document.querySelectorAll(".seccion");
    secciones.forEach(sec=>{
        sec.style.display="none";
    });
    document.getElementById(id).style.display="block";
    if(id=="pagos"){
        cargarProductosPago();
        mostrarPagos();
    }
}

function buscarClientes(){
    let input=
    document.getElementById("buscador").value.toLowerCase();
    let clientes=
    document.querySelectorAll(".cliente-item");
    clientes.forEach(cliente=>{
        let texto=
        cliente.innerText.toLowerCase();
        if(texto.includes(input)){
            cliente.style.display="block";
        }
        else{
            cliente.style.display="none";
        }
    });
}

function mostrarRenovar(id,nombre){
    let contenedor=
    document.getElementById("renovar-"+id);
    contenedor.innerHTML=
    "<input type='date' id='fecha-"+id+"'>"+
    "<input type='number' placeholder='Monto' id='monto-"+id+"'>"+
    "<button onclick='guardarRenovacion("+id+",\""+nombre+"\")'>Guardar</button>";
}

function guardarRenovacion(id,nombre){
    let nuevaFecha=
    document.getElementById("fecha-"+id).value;
    let monto=
    document.getElementById("monto-"+id).value;
    if(nuevaFecha==""||monto==""){
        mostrarNotificacion("Completa todos los campos","warning");
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
        if(respuesta=="ok"){
            mostrarNotificacion("Membresía renovada correctamente","success");
            mostrarClientes();
            mostrarPagos();
        }
        else{
            mostrarNotificacion("Ocurrió un error al renovar la membresía","error");
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
        if(respuesta=="ok"){
            mostrarNotificacion("Entrada registrada correctamente","success");
        }
        else{
            mostrarNotificacion("Ocurrió un error al registrar la entrada","error");
        }
    });
}

mostrarBicicletas();
function mostrarBicicletas(){
    fetch("../obtener_bicicletas.php")
    .then(res=>res.json())
    .then(bicis=>{
        let lista=
        document.getElementById("lista-bicicletas");
        lista.innerHTML="";
        for(let i=1;i<=26;i++){
            let bici=
            bicis.find(b=>b.bicicleta==i);
            let div=
            document.createElement("div");
            div.classList.add("bici");
            div.id="bici-"+i;
            if(bici){
                div.classList.add("ocupada");
                div.innerHTML=
                "<h3>Bici "+i+"</h3>"+
                "<p>"+bici.cliente+"</p>"+
                "<p>"+bici.telefono+"</p>"+
                "<button onclick='liberarBici("+bici.id+")'>Liberar</button>";
            }
            else{
                div.classList.add("libre");
                div.innerHTML=
                "<h3>Bici "+i+"</h3>"+
                "<button onclick='apartarBici("+i+")'>Apartar</button>";
            }
            lista.appendChild(div);
        }
    });
}

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
    document.getElementById("cliente-"+numero).value;
    let telefono=
    document.getElementById("telefono-"+numero).value;
    if(cliente.trim()==""||telefono.trim()==""){
        mostrarNotificacion("Completa todos los campos","warning");
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
        if(respuesta=="ok"){
            mostrarNotificacion("Bicicleta apartada correctamente","success");
            mostrarBicicletas();
        }
        else{
            mostrarNotificacion("No se pudo apartar la bicicleta","error");
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
        if(respuesta=="ok"){
            mostrarNotificacion("Bicicleta liberada correctamente","success");
            mostrarBicicletas();
        }
        else{
            mostrarNotificacion("No se pudo liberar la bicicleta","error");
        }
    });
}

//INVENTARIO
function registrarActivo(codigo){
    let hora=
    new Date().getHours();
    let turno=
    hora<13?"Apertura":"Cierre";
    let datos=
    new FormData();
    datos.append("codigo",codigo);
    datos.append("turno",turno);
    fetch("../guardar_revision.php",{
        method:"POST",
        body:datos
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.estado=="duplicado"){
            document.getElementById("resultado").innerHTML=
            "<div class='registro-error'>"+
            "<h2>⚠️ Activo ya registrado</h2>"+
            "<p><strong>Instrumento:</strong> "+data.nombre+"</p>"+
            "<p>Ya fue registrado en el turno <strong>"+data.turno+"</strong>.</p>"+
            "</div>";
            return;
        }
        if(data.estado!="ok"){
            document.getElementById("resultado").innerHTML=
            "<div class='registro-error'>"+
            "<h2>❌ Código no registrado</h2>"+
            "<p>El QR no pertenece a ningún activo.</p>"+
            "</div>";
            return;
        }
        document.getElementById("resultado").innerHTML=
        "<div class='registro-exitoso'>"+
        "<h2>✅ Activo registrado</h2>"+
        "<hr>"+
        "<p><strong>Instrumento:</strong> "+data.nombre+"</p>"+
        "<p><strong>Categoría:</strong> "+data.categoria+"</p>"+
        "<p><strong>Código:</strong> "+data.codigo+"</p>"+
        "<p><strong>Turno:</strong> "+data.turno+"</p>"+
        "<p><strong>Fecha:</strong> "+data.fecha+"</p>"+
        "<p><strong>Hora:</strong> "+data.hora+"</p>"+
        "</div>";
    })
    .catch(()=>{
        document.getElementById("resultado").innerHTML=
        "<div class='registro-error'>"+
        "<h2>❌ Error</h2>"+
        "<p>No fue posible registrar el activo.</p>"+
        "</div>";
    });
}

function iniciarEscaner(){
    document.getElementById("resultado").innerHTML="";
    let qr=
    new Html5Qrcode("reader");
    qr.start(
        {facingMode:"environment"},
        {
            fps:10,
            qrbox:250
        },
        function(codigo){
            qr.stop().then(()=>{
                registrarActivo(codigo);
            });
        },
        function(error){}
    );
}

function verQRCliente(codigo,nombre,fecha){
    document.getElementById("vigenciaCliente").innerHTML = fecha;
    document.getElementById("modalQRCliente").style.display = "flex";
    document.getElementById("nombreQRCliente").innerHTML = nombre;
    document.getElementById("textoCodigoCliente").innerHTML = codigo;
    let contenedor =
    document.getElementById("codigoQRCliente");
    contenedor.innerHTML = "";
    new QRCode(contenedor,{
        text: codigo,
        width:220,
        height:220
    });
}

function cerrarQRCliente(){
    document.getElementById("modalQRCliente").style.display = "none";
    document.getElementById("codigoQRCliente").innerHTML = "";
}

function cerrarSesion(){
    window.location = "../logout.php";
}

function actualizarFecha(){
    let ahora = new Date();
    let dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ];
    let meses = [
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
    document.getElementById("fecha-actual").innerHTML =
    "Hoy es " +
    dias[ahora.getDay()] +
    " " +
    ahora.getDate() +
    " de " +
    meses[ahora.getMonth()] +
    " de " +
    ahora.getFullYear();
}
actualizarFecha();


function mostrarNotificacion(mensaje, tipo){
    const contenedor = document.getElementById("notificaciones");
    const notificacion = document.createElement("div");
    notificacion.className = "notificacion " + tipo;
    notificacion.textContent = mensaje;
    contenedor.appendChild(notificacion);
    setTimeout(() => {
        notificacion.style.opacity = "0";
        setTimeout(() => {
            notificacion.remove();
        }, 400);
    }, 3000);
}

function cargarProductosPago(){
    fetch("../obtener_productos.php")
    .then(res=>res.json())
    .then(productos=>{
        let select=document.getElementById("producto_pago");
        select.innerHTML="<option value=''>Selecciona un producto</option>";
        productos.forEach(producto=>{
            select.innerHTML+=`
            <option value="${producto.id}" data-precio="${producto.precio}">
                ${producto.nombre} - $${producto.precio}
            </option>`;
        });
    });
}

function calcularTotal(){
    let select=
    document.getElementById("producto_pago");
    let cantidad=
    parseInt(document.getElementById("cantidad").value)||1;
    let textoTotal=
    document.getElementById("texto_total");
    if(select.value==""){
        textoTotal.innerHTML="$0.00";
        return;
    }
    let opcion=
    select.options[select.selectedIndex];
    let precio=
    parseFloat(opcion.dataset.precio);
    textoTotal.innerHTML=
    "$"+(precio*cantidad).toFixed(2);
}