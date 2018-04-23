import debounce from 'lodash.debounce';
import SmoothScroll from './vendor/smooth-scroll';
import elements, { header } from './elements';
import sections from './sections';
import avatar from './avatar';

const baseURL = '';
const snapToNearbySections = false;

let isScrolling = false;    // Indicates wheter smooth scrolling is taking place
let prevVisualSection;      // Section the occupies the very top of the screen (even if that's just 1 px)
let prevLogicalSection;     // Section that determines current url and active link in the menu

/**
 * Helper function: returns the section matching the id
 */
const getSection = (id) => sections.find(s => s.id === id);

const scroll = new SmoothScroll(null, {
    before: () => { isScrolling = true },                   // executed before smooth scroll
    after: () => { isScrolling = false; watchScroll(); },   // executed after smooth scroll
});

/**
 * Scrolls to the section specified in the URL.
 * Triggered on page (re-)load only.
 */
function checkStartingURL() {
    const section = getSectionFromUrl(window.location.pathname);
    scrollTo(section);
}

/**
 * Scroll callback function. Checks the current visual and logical sections,
 * and makes sure the UI reflects them.
 */
function watchScroll() {
    /* Avoid unnecessary changes while smooth scroll is running */
    if (isScrolling) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const visualSection = getVisualSection(scrollY);
    const logicalSection = getLogicalSection(scrollY);

    if (visualSection !== prevVisualSection) {
        applyHeaderStyle(visualSection);
    }

    if (logicalSection !== prevLogicalSection) {
        replaceHistory(logicalSection);
        markActiveLink(logicalSection);
        changeAvatar(logicalSection);
    }

    prevVisualSection = visualSection;
    prevLogicalSection = logicalSection;
}

function getVisualSection(scrollY) {
    return sections.find(s => s.occupies(scrollY));
}

function getLogicalSection(scrollY) {
    return sections.find(s => s.isLogicallyAt(scrollY));
}

/**
 * Resolves current section based on the URL.
 */
function getSectionFromUrl(currUrl) {

    const stripTrailingSlash = string => /(.*)\/?$/.exec(string)[1];

    const currSection = sections.find(s => 
        stripTrailingSlash(`${baseURL}/${s.url}`) === stripTrailingSlash(`${currUrl}`)
    );

    return currSection
        ? currSection
        : sections[0]; // default
}

/**
 * Smoothly scroll to the start of the specified section; scroll target is not the section container itself
 * but the corresponding anchor element, which may be positioned higher up to account for the fixed header.
 */
function scrollTo(section) {
    if (isScrolling) return;
    scroll.animateScroll(section.anchor);
}

/**
 * Replaces browser's history state to reflect the specified section
 */
function replaceHistory(currSection) {

    const {url, documentTitle} = currSection;

    window.history.replaceState({}, '', `${baseURL}/${url}`);
    document.title = documentTitle;
}

/**
 * Marks the link to the current section as active and all the other ones as inactive.
 */
function markActiveLink(currSection) {
    const currId = currSection.id;

    sections.forEach(({id, link}) => {
        if (link) link.classList[(id === currId ? 'add' : 'remove')]('is-active');
    });
}

/**
 * Adds a modifying class to the header element depending on the current section.
 */
function applyHeaderStyle(currSection) {
    const allClasses = sections.map(({id}) => `header--${id}`);
    header.classList.remove(...allClasses);
    header.classList.add(`header--${currSection.id}`);
}

/**
 * Tells the avatar to animate towards the view that matches the current section.
 */
function changeAvatar(currSection) {
    avatar.switchView(currSection.id);
}

/* ------------------------------------------------------------------- */

document.addEventListener('scroll', debounce(watchScroll, 30));
document.addEventListener('DOMContentLoaded', checkStartingURL);

/* ------------------------------------------------------------------- */

/**
 * Makes menu links trigger smooths scroll to respective sections.
 */
sections.forEach( section => {

    if (section.link) {
        section.link.addEventListener('click', (event) => {
            event.preventDefault();
            scrollTo(section);
        });
    }

});