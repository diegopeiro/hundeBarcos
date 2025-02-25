//Al pulsar el botón inicio reedirigimos al usuario a Tablero.html
window.onload = function () {

    document.getElementById("btnIniciar").addEventListener("click", function() {
        window.location.href = "index.html";
    });
};
