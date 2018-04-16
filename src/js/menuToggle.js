const btn = document.querySelector('.navigation__toggle');
const menu = document.querySelector('.navigation__menu');

function openMenu() {
    menu.classList.add('is-active'); 
    btn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-active');
}

function toggleMenu() {
    menu.classList.contains('is-active')
        ? closeMenu()
        : openMenu();
}

btn.addEventListener('click', toggleMenu);
menu.addEventListener('click', closeMenu);