function registrarEvento(accion) {
    gtag('event', accion, { 'event_category': 'Interacción' });
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".capa-rasca").forEach(capa => {
        capa.addEventListener("click", () => registrarEvento("Rasca Clic"));
    });

    document.getElementById("spotify-btn").addEventListener("click", () => registrarEvento("Clic Spotify"));
    document.getElementById("web-btn").addEventListener("click", () => registrarEvento("Clic Web"));
});
