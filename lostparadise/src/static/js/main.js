const loader = document.querySelector('.loader');
const cargador = document.querySelector('.cargador');
const contenidoPagina = document.querySelector('.contenido-pagina');
const body = document.querySelector('body');

/*
function init() {
    setTimeout(() => {
        loader.style.opacity = 0;
        loader.style.display = 'none';

        cargador.remove()
        body.style.display = 'block';
        contenidoPagina.style.display = 'block';
        setTimeout(() => {
            contenidoPagina.style.opacity = 1;
        }, 50);
    }, 4000);
}

init();
*/


window.addEventListener('load', function() {
    loader.style.opacity = 0;
    loader.style.display = 'none';

    cargador.remove()
    body.style.display = 'block';
    contenidoPagina.style.display = 'block';
    contenidoPagina.style.opacity = 1;
});

