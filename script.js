// Guardar en localStorage si el usuario ya jugó
function guardarJuegoEnLocal() {
    localStorage.setItem("rascaJugado", "true");
}

// Verificar si ya jugó
function verificarSiYaJugo() {
    return localStorage.getItem("rascaJugado") !== null;
}

document.addEventListener("DOMContentLoaded", function () {
    const rascaContainer = document.getElementById("rasca-container");
    const modal = document.getElementById("modal");
    const modalInstrucciones = document.getElementById("instrucciones-modal");
    const cerrarInstrucciones = document.getElementById("cerrar-instrucciones");
    const tituloModal = document.getElementById("titulo-modal");

    let descubiertos = 0;
    let seleccionados = [];

    // 📌 Registrar entrada desde el QR en Google Analytics
    gtag('event', 'qr_escaneado', {
        event_category: 'Interacciones',
        event_label: 'Usuario entró al Rasca y Gana'
    });

    // Mostrar el modal de instrucciones al cargar la página
    modalInstrucciones.style.display = "flex";

    cerrarInstrucciones.addEventListener("click", function () {
        modalInstrucciones.style.display = "none";
    });

    window.onclick = function (event) {
        if (event.target === modalInstrucciones) {
            modalInstrucciones.style.display = "none";
        }
    };

    // Si ya jugó, mostrar modal directamente
    if (verificarSiYaJugo()) {
        modal.style.display = "flex";
        return;
    }

    // Seleccionar aleatoriamente 9 elementos
    while (seleccionados.length < 9) {
        let item = elementos[Math.floor(Math.random() * elementos.length)];
        if (item.nombre === "logo" && seleccionados.filter(i => i.nombre === "logo").length >= maxLogos) {
            continue;
        }
        seleccionados.push(item);
    }

    seleccionados.forEach((item, index) => {
        let div = document.createElement("div");
        div.classList.add("rasca");

        let img = document.createElement("img");
        img.src = item.imagen;

        let capa = document.createElement("div");
        capa.classList.add("capa-rasca");
        capa.dataset.index = index; // Guardar índice para Google Analytics

        // 📌 Al hacer clic, se descubre el recuadro
        capa.addEventListener("click", function () {
            if (capa.style.opacity !== "0") {
                capa.style.opacity = "0";
                descubiertos++;

                // 📌 Registrar descubrimiento del recuadro en Google Analytics
                gtag('event', 'recuadro_descubierto', {
                    event_category: 'Interacciones',
                    event_label: `Recuadro ${index + 1} descubierto`
                });

                // Si se descubren todos los recuadros, mostrar el modal final
                if (descubiertos === 9) {
                    setTimeout(mostrarModal, 1000);
                }
            }
        });

        div.appendChild(img);
        div.appendChild(capa);
        rascaContainer.appendChild(div);
    });

    function mostrarModal() {
        modal.style.display = "flex";
        tituloModal.innerHTML = `¡Ohhh! No conseguiste el mínimo`;

        // 📌 Registrar que el usuario llegó al modal final
        gtag('event', 'rasca_completado', {
            event_category: 'Interacciones',
            event_label: 'Usuario completó el Rasca y Gana'
        });

        // Registrar clics en botones e iconos del modal final
        registrarEventosModal();
    }

    function registrarEventosModal() {
        document.getElementById("web-btn").addEventListener("click", function () {
            gtag('event', 'clic_web', {
                event_category: 'Interacciones',
                event_label: 'Usuario visitó la página oficial'
            });
        });

        document.querySelectorAll(".fila-redes a").forEach((link, i) => {
            link.addEventListener("click", function () {
                gtag('event', 'clic_red_social', {
                    event_category: 'Interacciones',
                    event_label: `Clic en red social ${i + 1}`
                });
            });
        });
    }
});
