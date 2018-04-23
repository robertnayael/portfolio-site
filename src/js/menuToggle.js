import { menu, menuBtn } from './elements';

function openMenu() {
    menu.classList.add('is-active'); 
    menuBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    menu.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
    menu.classList.contains('is-active')
        ? closeMenu()
        : openMenu();
}

menuBtn.addEventListener('click', toggleMenu);
menu.addEventListener('click', closeMenu);