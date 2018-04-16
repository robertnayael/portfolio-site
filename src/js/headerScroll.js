const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const method = window.scrollY > 0 ? 'remove' : 'add';
    header.classList[method]('header--at-top');
})