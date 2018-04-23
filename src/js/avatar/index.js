import Avatar from './Avatar';
import { avatarCanvas } from '../elements';

/*----------------------------------------------------------------*/

const sprites = {
    body: {
        src: './img/avatar/body.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    headtop: {
        src: './img/avatar/headtop.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    headfront: {
        src: './img/avatar/headfront.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    github: {
        src: './img/avatar/github.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    about: {
        src: './img/avatar/about.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    react: {
        src: './img/avatar/react.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    html: {
        src: './img/avatar/html.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    js: {
        src: './img/avatar/js.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    },
    envelope: {
        src: './img/avatar/envelope.png',
        x: 0,
        y: 0,
        width: 255,
        height: 430,
    }
}

/*----------------------------------------------------------------*/

const avatar = new Avatar({
    canvas: avatarCanvas,
    width: 255,
    height: 430,
    bgSprite: sprites.body,
    fgSprite: sprites.headfront
});

/*----------------------------------------------------------------*/

const intro = {
    sprite: sprites.headtop,
    startY: 130,
    duration: 1500,
    delay: 1000
};

const about = {
    sprite: sprites.about,
    startY: 165,
    duration: 2000,
    delay: 1000
};

const react = {
    sprite: sprites.react,
    startY: 135,
    duration: 3000,
    delay: 1000
};

const html = {
    sprite: sprites.html,
    startY: 145,
    duration: 2000,
    delay: 2000
};

const js = {
    sprite: sprites.js,
    startY: 155,
    duration: 2000,
    delay: 1000
};

const github = {
    sprite: sprites.github,
    startY: 135,
    duration: 2000,
    delay: 1000
};

const envelope = {
    sprite: sprites.envelope,
    startY: 135,
    duration: 1000,
    delay: 1000
};

/*----------------------------------------------------------------*/

avatar.addView({
    id: 'intro',
    animations: [intro],
    isFirst: true
});

avatar.addView({
    id: 'about',
    animations: [about]
});

avatar.addView({
    id: 'skills',
    animations: [html, js, react]
});

avatar.addView({
    id: 'projects',
    animations: [github]
});

avatar.addView({
    id: 'contact-me',
    animations: [envelope]
});

/*----------------------------------------------------------------*/

avatar.init();
avatar.switchView('intro');

export default avatar;