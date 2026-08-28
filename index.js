function login(){
    let usuario =
    document.getElementById("usuario").value;
    let password =
    document.getElementById("password").value;
    let datos =
    new FormData();
    datos.append("usuario", usuario);
    datos.append("password", password);
    fetch("login.php", {
        method:"POST",
        body:datos
    })
    .then(res => res.text())
    .then(respuesta => {
        if(respuesta == "admin"){
    window.location =
    "admin/dashboard.php";
}
else if(respuesta == "empleado"){
    window.location =
    "empleado/dashboard.php";
}
    });
}