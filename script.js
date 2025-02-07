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

    // 📌 Registrar entrada al rasca desde QR
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

        let canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 160;
        canvas.classList.add("capa-rasca");

        let ctx = canvas.getContext("2d");
        let textura = new Image();
        textura.src = 'assets/textura-dorado.png';

        textura.onload = function () {
            ctx.drawImage(textura, 0, 0, canvas.width, canvas.height);
        };

        div.appendChild(img);
        div.appendChild(canvas);
        rascaContainer.appendChild(div);

        let isScratching = false;
        const radio = 20;
        let pixelesBorrados = 0;

        // 📌 Registrar cuando el usuario empieza a rascar
        function startScratching(event) {
            isScratching = true;
            scratch(event);

            gtag('event', 'rasca_iniciado', {
                event_category: 'Interacciones',
                event_label: 'Usuario comenzó a rascar'
            });
        }

        // Función para borrar la zona rascada
        function scratch(event) {
            if (!isScratching) return;

            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX || event.touches[0].clientX) - rect.left;
            const y = (event.clientY || event.touches[0].clientY) - rect.top;

            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, radio, 0, Math.PI * 2);
            ctx.fill();

            // Contar los píxeles borrados
            pixelesBorrados = calcularPixelesBorrados(ctx, canvas);

            if (pixelesBorrados >= 0.85) {
                canvas.remove(); // Descubrir completamente el recuadro
                descubiertos++;

                // 📌 Registrar descubrimiento del recuadro
                gtag('event', 'recuadro_descubierto', {
                    event_category: 'Interacciones',
                    event_label: `Recuadro ${index + 1} descubierto`
                });

                // Si se han descubierto todos, mostrar el modal final
                if (descubiertos === 9) {
                    mostrarModal();
                }
            }
        }

        function stopScratching() {
            isScratching = false;
        }

        function calcularPixelesBorrados(ctx, canvas) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let total = imageData.data.length / 4;
            let transparentes = 0;

            for (let i = 3; i < imageData.data.length; i += 4) {
                if (imageData.data[i] === 0) {
                    transparentes++;
                }
            }
            return transparentes / total;
        }

        // Eventos para ratón y táctiles
        canvas.addEventListener("mousedown", startScratching);
        canvas.addEventListener("mousemove", scratch);
        canvas.addEventListener("mouseup", stopScratching);
        canvas.addEventListener("mouseleave", stopScratching);

        canvas.addEventListener("touchstart", (event) => {
            event.preventDefault();
            startScratching(event);
        });

        canvas.addEventListener("touchmove", (event) => {
            event.preventDefault();
            scratch(event);
        });

        canvas.addEventListener("touchend", stopScratching);
    });

    function mostrarModal() {
        modal.style.display = "flex";
        tituloModal.innerHTML = `¡Ohhh! No conseguiste el mínimo`;

        // 📌 Registrar finalización del rasca
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
