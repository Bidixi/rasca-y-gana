function guardarJuegoEnLocal() {
    localStorage.setItem("rascaJugado", "true");
}

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

    // Mostrar el modal de instrucciones al cargar la página
    modalInstrucciones.style.display = "flex";

    // Cerrar el modal cuando se hace clic en la X o fuera del modal
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
        canvas.classList.add("capa-rasca");

        let ctx = canvas.getContext("2d");
        let textura = new Image();
        textura.src = 'assets/textura-dorado.png';

        // Configurar el tamaño del canvas al cargar la imagen
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(textura, 0, 0, canvas.width, canvas.height);
        };

        textura.onload = function () {
            ctx.drawImage(textura, 0, 0, canvas.width, canvas.height);
        };

        div.appendChild(img);
        div.appendChild(canvas);
        rascaContainer.appendChild(div);

        let isScratching = false;

        function startScratching(event) {
            isScratching = true;
            scratch(event);
        }

        function scratch(event) {
            if (!isScratching) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX || event.touches[0].clientX) - rect.left;
            const y = (event.clientY || event.touches[0].clientY) - rect.top;

            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        function stopScratching() {
            isScratching = false;
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
    }
});
