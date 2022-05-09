const hamburguer = document.querySelector('.hamburguer');
const nav = document.querySelector('.navegacion');

hamburguer.addEventListener('click', () => {
    nav.classList.toggle('show');
})