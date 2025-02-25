const tablero = document.getElementById("tablero");
const botonEmpezar = document.getElementById("empezarJuego");
const turnoTexto = document.getElementById("turno");

const filas = 10;
const columnas = 10;
let turnoRojo = true; // Indica si es el turno de colocar barcos
let barcosColocados = 0;
let intentosJugador = 0;

// Lista de barcos a colocar (tamaño de cada barco)
const listaBarcos = [4, 3, 3, 2, 2, 2];
let barcos = []; // Guarda las posiciones de los barcos
let tableroOculto = [];

// FUNCIÓN PARA CREAR O REINICIAR EL TABLERO
function crearTablero() {
    tablero.innerHTML = ""; // Limpia el tablero antes de crearlo de nuevo
    tableroOculto = Array(filas).fill().map(() => Array(columnas).fill(0));
    barcos = [];
    turnoRojo = true;
    barcosColocados = 0;
    intentosJugador = 0;
    turnoTexto.innerText = "Turno del Jugador Rojo: Coloca los barcos";

    // HABILITAR EL BOTÓN "EMPEZAR JUEGO"
    botonEmpezar.disabled = false;
    botonEmpezar.innerText = "Reiniciar Juego";

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            celda.addEventListener("click", manejarClick);
            tablero.appendChild(celda);
        }
    }
}

// FUNCIÓN PARA MANEJAR LOS CLICKS EN EL TABLERO
function manejarClick(event) {
    const celda = event.target;
    const fila = parseInt(celda.dataset.fila);
    const columna = parseInt(celda.dataset.columna);

    if (turnoRojo) {
        colocarBarco(fila, columna, celda);
    } else {
        realizarDisparo(fila, columna, celda);
    }
}

// COLOCAR BARCOS (JUGADOR ROJO)
function colocarBarco(fila, columna, celda) {
    if (barcosColocados >= listaBarcos.length) return;

    let tamañoBarco = listaBarcos[barcosColocados];
    if (columna + tamañoBarco > columnas) return;

    // Verificar si hay espacio disponible
    for (let i = 0; i < tamañoBarco; i++) {
        if (tableroOculto[fila][columna + i] !== 0) return;
    }

    // Guardar barco en la matriz oculta
    let barcoPosiciones = [];
    for (let i = 0; i < tamañoBarco; i++) {
        tableroOculto[fila][columna + i] = 1;
        let celdaBarco = document.querySelector(`[data-fila="${fila}"][data-columna="${columna + i}"]`);
        celdaBarco.classList.add("barco", "visible"); // Se ve cuando lo coloca
        barcoPosiciones.push([fila, columna + i]);
    }

    barcos.push(barcoPosiciones);
    barcosColocados++;

    if (barcosColocados >= listaBarcos.length) {
        turnoRojo = false;
        turnoTexto.innerText = "Turno del Jugador Amarillo: Dispara!";
        
        // Hacer desaparecer los barcos al cambiar de turno
        setTimeout(() => {
            document.querySelectorAll(".barco").forEach(celda => {
                celda.classList.remove("visible");
                celda.classList.remove("barco");
            });
        }, 200);
    }
}

// REALIZAR DISPARO (JUGADOR AMARILLO)
function realizarDisparo(fila, columna, celda) {
    if (celda.classList.contains("tocado") || celda.classList.contains("agua")) return;

    intentosJugador++;
    let acierto = false;

    barcos.forEach((barco, index) => {
        barco.forEach((pos, posIndex) => {
            if (pos[0] === fila && pos[1] === columna) {
                celda.classList.add("tocado");
                barco.splice(posIndex, 1);
                acierto = true;

                if (barco.length === 0) {
                    barcos.splice(index, 1);
                    alert("¡Has hundido un barco!");
                }
            }
        });
    });

    if (!acierto) {
        celda.classList.add("agua");
        alert("Agua...");
    }

    if (barcos.length === 0) {
        alert(`¡Has ganado! Intentos: ${intentosJugador}`);
        document.cookie = `mejorResultado=${intentosJugador}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

        // HABILITAR EL BOTÓN PARA REINICIAR
        botonEmpezar.disabled = false;
    }
}

// FUNCIÓN PARA REINICIAR EL JUEGO AL HACER CLIC EN "EMPEZAR JUEGO"
botonEmpezar.addEventListener("click", () => {
    crearTablero();
});

// INICIAR EL JUEGO AL CARGAR LA PÁGINA
crearTablero();

//Botón para ir al inicio
window.onload = function () {

    document.getElementById("btnIniciar").addEventListener("click", function() {
        window.location.href = "tablero.html";
    });
};
