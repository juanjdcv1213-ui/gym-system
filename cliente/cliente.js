function mostrarSeccion(id){
    let secciones =
    document.querySelectorAll(".seccion");
    secciones.forEach(sec => {
        sec.style.display = "none";
    });
    document.getElementById(id).style.display =
    "block";
    if(id == "spinning"){
        mostrarBicicletas();
    }
}

function mostrarBicicletas(){
    fetch("../obtener_bicicletas_cliente.php")
    .then(res => res.json())
    .then(bicis => {
        let lista =
        document.getElementById("lista-bicis");
        lista.innerHTML = "";
        for(let i = 1; i <= 26; i++){
            let biciData =
            bicis.find(b => b.bicicleta == i);
            let div =
            document.createElement("div");
            div.classList.add("bici");
            div.id = "bici-" + i;
            if(biciData){
                div.classList.add("ocupada");
                div.innerHTML =
                "<h3>Bici " + i + "</h3>" +
                "<p>Ocupada</p>";
            }
            else{
                div.classList.add("libre");
                div.innerHTML =
                "<h3>Bici " + i + "</h3>" +
                "<button onclick='apartarBici(" + i + ")'>Apartar</button>";
            }
            lista.appendChild(div);
        }
    });
}

function apartarBici(numero){
    let bici =
    document.getElementById("bici-" + numero);
    bici.innerHTML =
    "<h3>Bici " + numero + "</h3>" +
    "<input type='text' id='cliente-" + numero + "' placeholder='Nombre'><br><br>" +
    "<input type='text' id='telefono-" + numero + "' placeholder='Celular'><br><br>" +
    "<button onclick='guardarBici(" + numero + ")'>Guardar</button>";
}

function guardarBici(numero){
    let cliente =
    document.getElementById("cliente-" + numero).value;
    let telefono =
    document.getElementById("telefono-" + numero).value;
    if(cliente == "" || telefono == ""){
        mostrarNotificacion("Completa todos los campos","warning");
        return;
    }
    let datos =
    new FormData();
    datos.append("bicicleta", numero);
    datos.append("cliente", cliente);
    datos.append("telefono", telefono);
    fetch("../guardar_bicicleta_cliente.php", {
        method:"POST",
        body:datos
    })
    .then(res => res.text())
    .then(respuesta => {
    console.log(respuesta);
    if(respuesta.trim() == "ok"){
        mostrarNotificacion("Bicicleta apartada correctamente","success");
        mostrarBicicletas();
    }else{
        mostrarNotificacion(respuesta,"error");
    }
});
}
mostrarBicicletas();

function mostrarNotificacion(mensaje, tipo){
    let contenedor = document.getElementById("notificaciones");
    let noti = document.createElement("div");
    noti.className = "notificacion " + tipo;
    noti.textContent = mensaje;
    contenedor.appendChild(noti);
    setTimeout(() => {
        noti.style.opacity = "0";
        setTimeout(() => {
            noti.remove();
        }, 400);
    }, 3000);
}