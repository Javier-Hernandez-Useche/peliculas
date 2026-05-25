
let loadMoreBtn1 = document.querySelector('#load-more-1');
let currentItem1 = 4;
loadMoreBtn1.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container1 .box-1')];
    for (let i = currentItem1; i < currentItem1 + 4; i++) {
        if (boxes[i]) {
            boxes[i].style.display = 'inline-block';
        }
    }
    currentItem1 += 4;
    if (currentItem1 >= boxes.length) {
        loadMoreBtn1.style.display = 'none';
    }
};
let loadMoreBtn2 = document.querySelector('#load-more-2');
let currentItem2 = 4;
loadMoreBtn2.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container2 .box-2')];
    for (let i = currentItem2; i < currentItem2 + 4; i++) {
        if (boxes[i]) {
            boxes[i].style.display = 'inline-block';
        }
    }
    currentItem2 += 4;
    if (currentItem2 >= boxes.length) {
        loadMoreBtn2.style.display = 'none';
    }
};
let loadMoreBtn3 = document.querySelector('#load-more-3');
let currentItem3 = 4;
loadMoreBtn3.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container3 .box-3')];
    for (let i = currentItem3; i < currentItem3 + 4; i++) {
        if (boxes[i]) {
            boxes[i].style.display = 'inline-block';
        }
    }
    currentItem3 += 4;

    if (currentItem3 >= boxes.length) {
        loadMoreBtn3.style.display = 'none';
    }
};

const formulario = document.getElementById("formulario-pelicula");
const grilla = document.getElementById("grilla-peliculas");

const tituloInput = document.getElementById("titulo");
const directorInput = document.getElementById("director");
const anioInput = document.getElementById("anio");
const categoriaInput = document.getElementById("categoria");
const puntuacionInput = document.getElementById("puntuacion");
const sinopsisInput = document.getElementById("sinopsis");

const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenarPor = document.getElementById("ordenar-por");

const estadoVacio = document.getElementById("estado-vacio");
const estadoInicial = document.getElementById("estado-inicial");

const contadorTotal = document.getElementById("contador-total");
const textoResultados = document.getElementById("texto-resultados");

const btnCancelar = document.getElementById("btn-cancelar");
const formTituloPanel = document.getElementById("form-titulo-panel");

const modalEliminar = document.getElementById("modal-eliminar");
const modalNombrePelicula = document.getElementById("modal-nombre-pelicula");

const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");
const btnCancelarEliminar = document.getElementById("btn-cancelar-eliminar");

const toast = document.getElementById("toast");

let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];

let peliculaEditando = null;
let peliculaEliminar = null;

const estrellas = document.querySelectorAll(".star");
estrellas.forEach(star => {
    star.addEventListener("click", () => {
        let valor = star.dataset.valor;
        puntuacionInput.value = valor;
        actualizarEstrellas(valor);
    });
});
function actualizarEstrellas(valor) {
    estrellas.forEach(star => {
        if (star.dataset.valor <= valor) {
            star.style.color = "gold";
        } else {
            star.style.color = "#666";
        }

    });

}
function limpiarErrores() {
    document.getElementById("error-titulo").textContent = "";
    document.getElementById("error-director").textContent = "";
    document.getElementById("error-anio").textContent = "";
    document.getElementById("error-categoria").textContent = "";
}
function validarFormulario() {
    limpiarErrores();
    let valido = true;
    const titulo = tituloInput.value.trim();
    const director = directorInput.value.trim();
    const anio = parseInt(anioInput.value);
    const categoria = categoriaInput.value;

    if (titulo.length < 2) {
        document.getElementById("error-titulo").textContent =
            "El título debe tener mínimo 2 caracteres";
        valido = false;
    }
    if (director.length < 3) {
        document.getElementById("error-director").textContent =
            "El director debe tener mínimo 3 caracteres";
        valido = false;
    }
    if (isNaN(anio) || anio < 1900 || anio > 2026) {
        document.getElementById("error-anio").textContent =
            "El año debe estar entre 1900 y 2026";
        valido = false;
    }
    if (categoria === "") {
        document.getElementById("error-categoria").textContent =
            "Debe seleccionar una categoría";
        valido = false;
    }
    return valido;

}
formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    if (!validarFormulario()) return;
    const pelicula = {
        id: peliculaEditando || Date.now(),
        titulo: tituloInput.value.trim(),
        director: directorInput.value.trim(),
        anio: anioInput.value,
        categoria: categoriaInput.value,
        puntuacion: puntuacionInput.value,
        sinopsis: sinopsisInput.value.trim()
    };
    if (peliculaEditando) {
        peliculas = peliculas.map(p =>
            p.id === peliculaEditando ? pelicula : p
        );

        mostrarToast("Película actualizada");

    } else {

        peliculas.push(pelicula);
        mostrarToast("Película registrada");

    }
    guardarLocalStorage();
    renderPeliculas();
    formulario.reset();
    actualizarEstrellas(0);
    puntuacionInput.value = 0;
    peliculaEditando = null;
    btnCancelar.style.display = "none";
    formTituloPanel.textContent = "Registrar Película";

});
function renderPeliculas() {
    grilla.innerHTML = "";
    let resultado = [...peliculas];
    const textoBusqueda = buscador.value.toLowerCase();
    const categoria = filtroCategoria.value;
    const orden = ordenarPor.value;
    resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(textoBusqueda)
    );
    if (categoria !== "Todas") {

        resultado = resultado.filter(p =>
            p.categoria === categoria
        );
    }
    if (orden === "titulo") {

        resultado.sort((a, b) =>
            a.titulo.localeCompare(b.titulo)
        );

    }
    if (orden === "anio-asc") {

        resultado.sort((a, b) =>
            a.anio - b.anio
        );

    }
    if (orden === "anio-desc") {

        resultado.sort((a, b) =>
            b.anio - a.anio
        );

    }
    if (orden === "puntuacion") {

        resultado.sort((a, b) =>
            b.puntuacion - a.puntuacion
        );
    }
    contadorTotal.textContent = peliculas.length;
    textoResultados.textContent =
        `Mostrando ${resultado.length} película(s)`;

    estadoInicial.style.display =
        peliculas.length === 0 ? "block" : "none";

    estadoVacio.style.display =
        peliculas.length > 0 && resultado.length === 0
            ? "block"
            : "none";

    resultado.forEach(pelicula => {
        const card = document.createElement("div");
        card.classList.add("card-pelicula");
        card.innerHTML = `
            <h3>${pelicula.titulo}</h3>
            <p><strong>Director:</strong> ${pelicula.director}</p>
            <p><strong>Año:</strong> ${pelicula.anio}</p>
            <p><strong>Categoría:</strong> ${pelicula.categoria}</p>
            <p><strong>Puntuación:</strong> ${"★".repeat(pelicula.puntuacion)}</p>
            <p>${pelicula.sinopsis || "Sin sinopsis"}</p>
            <div class="card-acciones">
                <button class="btn btn-secundario editar-btn">
                    Editar
                </button>

                <button class="btn btn-peligro eliminar-btn">
                    Eliminar
                </button>

            </div>
        `;

        card.querySelector(".editar-btn")
            .addEventListener("click", () => {
                peliculaEditando = pelicula.id;
                tituloInput.value = pelicula.titulo;
                directorInput.value = pelicula.director;
                anioInput.value = pelicula.anio;
                categoriaInput.value = pelicula.categoria;
                puntuacionInput.value = pelicula.puntuacion;
                sinopsisInput.value = pelicula.sinopsis;

                actualizarEstrellas(pelicula.puntuacion);
                btnCancelar.style.display = "inline-block";
                formTituloPanel.textContent =
                    "Editar Película";
                window.scrollTo({
                    top: 500,
                    behavior: "smooth"
                });

            });

        card.querySelector(".eliminar-btn")
            .addEventListener("click", () => {

                peliculaEliminar = pelicula.id;
                modalNombrePelicula.textContent =
                    pelicula.titulo;
                modalEliminar.style.display = "flex";

            });

        grilla.appendChild(card);

    });

}
btnConfirmarEliminar.addEventListener("click", () => {

    peliculas = peliculas.filter(
        p => p.id !== peliculaEliminar
    );
    guardarLocalStorage();
    renderPeliculas();
    modalEliminar.style.display = "none";
    mostrarToast("Película eliminada");

});
btnCancelarEliminar.addEventListener("click", () => {
    modalEliminar.style.display = "none";

});

btnCancelar.addEventListener("click", () => {
    peliculaEditando = null;
    formulario.reset();
    actualizarEstrellas(0);
    puntuacionInput.value = 0;
    btnCancelar.style.display = "none";
    formTituloPanel.textContent = "Registrar Película";

});

buscador.addEventListener("input", renderPeliculas);
filtroCategoria.addEventListener("change", renderPeliculas);
ordenarPor.addEventListener("change", renderPeliculas);
function guardarLocalStorage() {
    localStorage.setItem(
        "peliculas",
        JSON.stringify(peliculas)
    );
}
function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}
renderPeliculas();
document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btn-login");
    const modalLogin = document.getElementById("login-modal");
    const loginSubmit = document.getElementById("login-submit");
    const loginClose = document.getElementById("login-close");
    const loginError = document.getElementById("login-error");

    const usuario = document.getElementById("usuario");
    const password = document.getElementById("password");

    const USER = "admin";
    const PASS = "1234";

    console.log("Login JS cargado");

    btnLogin.addEventListener("click", () => {
        modalLogin.style.display = "flex";
    });

    loginClose.addEventListener("click", () => {
        modalLogin.style.display = "none";
        loginError.textContent = "";
    });

    loginSubmit.addEventListener("click", () => {
        if (usuario.value === USER && password.value === PASS) {
            alert("Bienvenido");
            modalLogin.style.display = "none";
        } else {
            loginError.textContent = "❌ Usuario o contraseña incorrectos";
        }
    });

});
const btnPlay = document.getElementById("btn-play");
const videoModal = document.getElementById("video-modal");
const cerrarVideo = document.getElementById("cerrar-video");
const trailer = document.getElementById("trailer");

btnPlay.addEventListener("click", () => {
    videoModal.style.display = "flex";
    trailer.src =
    "https://www.youtube.com/embed/0WWzgGyAH6Y?autoplay=1&rel=0&modestbranding=1";
});

cerrarVideo.addEventListener("click", () => {
    videoModal.style.display = "none";
    trailer.src = "";
});
