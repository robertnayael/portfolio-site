import Avatar from './Avatar';
import {header, sections, avatarCanvas} from '../elements';

/*----------------------------------------------------------------*/

const getViewportHeight = () => window.innerHeight;
const getSectionStart = (section) => section.offsetTop - header.scrollHeight;
const getSectionEnd = (section) => section.offsetTop + section.scrollHeight;
const getSectionHeight = (section) => parseInt(window.getComputedStyle(section).height, 10);

/*----------------------------------------------------------------*/

const sprites = {
    body: {
        src: './img/avatar/body.png',
        x: 0,
        y: 0,
        width: 290,
        height: 448
    },
    headtop: {
        src: './img/avatar/headtop.png',
        x: 0,
        y: 0,
        width: 290,
        height: 448
    },
    headfront: {
        src: './img/avatar/headfront.png',
        x: 0,
        y: 0,
        width: 290,
        height: 448
    },
    github: {
        src: './img/avatar/github.png',
        x: 0,
        y: 0,
        width: 290,
        height: 448
    }
}

/*----------------------------------------------------------------*/

const avatar = new Avatar({
    canvas: avatarCanvas,
    width: 290,
    height: 450
});

/*----------------------------------------------------------------*/

/* BODY */
avatar.addSprite(sprites.body)
    .position({x: 0, y: 0});

/* HEAD TOP: TOP OF PAGE */
avatar.addSprite(sprites.headtop)
    .position({x: 0, y: [0, 150]})
    .progression(
        () => ({
            start: 0,
            end: getSectionHeight(sections.intro) - (getViewportHeight() / 2)
        })
    )
    .visibility(
        () => ({
            start: 0,
            end: getSectionHeight(sections.intro) - (getViewportHeight() / 2)
        })
    );


/* GITHUB (APPEAR) */
avatar.addSprite(sprites.github)
    .position({x: 0, y: [155, 0]})
    .progression(
        () => ({
            start: getSectionStart(sections.projects) - (getViewportHeight() / 2),
            end: getSectionStart(sections.projects) - 1
        })
    )
    .visibility(
        () => ({
            start: getSectionStart(sections.projects) - (getViewportHeight() / 2),
            end: getSectionStart(sections.projects) - 1
        })
    );

/* GITHUB (STAY) */
avatar.addSprite(sprites.github)
    .position({x: 0, y: 0})
    .visibility(
        () => ({
            start: getSectionStart(sections.projects),
            end: getSectionStart(sections.projects) + getViewportHeight() / 4 - 1
        })
    );

/* GITHUB (DISAPPEAR) */
avatar.addSprite(sprites.github)
    .position({x: 0, y: [0, 155]})
    .progression(
        () => ({
            start: getSectionStart(sections.projects) + getViewportHeight() / 4,
            end: getSectionStart(sections.projects) + getViewportHeight() / 2
        })
    )
    .visibility(
        () => ({
            start: getSectionStart(sections.projects) + getViewportHeight() / 4,
            end: getSectionStart(sections.projects) + getViewportHeight() / 2
        })
    );

/* HEAD FRONT */
avatar.addSprite(sprites.headfront)
    .position({x: 0, y: 0});

/*----------------------------------------------------------------*/

avatar.init();

/*----------------------------------------------------------------*/