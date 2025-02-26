document.addEventListener("DOMContentLoaded", () => {
    const tablero = document.getElementById("tablero");
    const empezarJuegoBtn = document.getElementById("empezarJuego");
    const turnoTexto = document.getElementById("turno");

    // Crear tablero
    for (let i = 0; i < 100; i++) {
        let celda = document.createElement("div");
        celda.classList.add("celda");
        celda.dataset.index = i;
        tablero.appendChild(celda);
    }

    // Hacer los barcos arrastrables
    interact(".barco").draggable({
        inertia: true,
        autoScroll: true,
        listeners: {
            move(event) {
                let target = event.target;
                let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
                let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
            },
        },
    });

    // Hacer las celdas dropeables
    interact(".celda").dropzone({
        accept: ".barco",
        overlap: 0.75,
        ondragenter(event) {
            event.target.classList.add("drop-target");
        },
        ondragleave(event) {
            event.target.classList.remove("drop-target");
        },
        ondrop(event) {
            let barco = event.relatedTarget;
            let celda = event.target;
            
            // Ajustar la posición del barco dentro de la celda
            barco.style.transform = "translate(0, 0)";
            barco.removeAttribute("data-x");
            barco.removeAttribute("data-y");
            
            // Mover el barco a la celda
            celda.appendChild(barco);
            celda.classList.add("barco");
        },
    });

    // Botón para empezar el juego
    empezarJuegoBtn.addEventListener("click", () => {
        turnoTexto.textContent = "¡Empieza el juego! Turno del primer jugador";
    });

    // Botón para salir
    document.getElementById("btnSalir").addEventListener("click", () => {
        alert("Saliendo del juego...");
        window.close();
    });
});
