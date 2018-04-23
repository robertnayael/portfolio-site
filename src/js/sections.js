import { header } from './elements';

const props = [
    {
        id: 'intro',
        url: '',
        documentTitle: 'Robert Gulewicz',
        snapToNextAt: 1
    },
    {
        id: 'about',
        url: 'about',
        documentTitle: 'About me',
        snapToNextAt: 0.5
    },
    {
        id: 'skills',
        url: 'skills',
        documentTitle: 'Skills',
        snapToNextAt: 0.5
    },
    {
        id: 'projects',
        url: 'projects',
        documentTitle: 'Projects',
        snapToNextAt: 0.5
    },
    {
        id: 'contact-me',
        url: 'contact-me',
        documentTitle: 'Contact me',
        snapToNextAt: 0.5
    },
];

export const sections = props.map((item, i) => ({

    ...item,
    
    prevSection: (props[i-1] ? props[i-1].id : null),
    nextSection: (props[i+1] ? props[i+1].id : null),
    
    section: document.getElementById(`section-${item.id}`),
    anchor: document.getElementById(`anchor-${item.id}`),
    link: document.getElementById(`link-${item.id}`),

    getStartY: function() {
        return this.anchor.offsetTop
    },

    getEndY: function() {
        return this.section.offsetTop + this.section.scrollHeight
            - (this.section.offsetTop - this.anchor.offsetTop);
    },

    getHeaderOffset: function() {
        return this.section.offsetTop - this.anchor.offsetTop;
    },

    occupies: function(y) {
        return y >= this.getStartY() && y < this.getEndY();
    },

    isLogicallyAt(y) {
        const range = {
            start: this.getStartY() - window.innerHeight / 2,
            end: this.getEndY() - window.innerHeight / 2
        };
        return y > range.start && y <= range.end;
    },

    isInBottomSnapRange: function(y) {
        const snapHeight = window.innerHeight / 2;
        const range = {
            top: this.getEndY() - snapHeight,
            bottom: this.getEndY()
        };
        return y > range.top && y <= range.bottom;
    },

    shouldSnapDown(y) {
        if (!this.nextSection) return false;
        const snapHeight = window.innerHeight / 2;
        const range = {
            top: this.getEndY() - snapHeight,
            bottom: this.getEndY()
        };
        return y > range.top && y <= range.bottom;
    },

    shouldSnapUp(y) {
        const snapHeight = window.innerHeight / 2;
        const range = {
            top: this.getStartY(),//this.getEndY() - window.innerHeight,//this.getStartY(),
            bottom: this.getEndY() - window.innerHeight + snapHeight//this.getStartY() + snapHeight
        };
        return y > range.top && y <= range.bottom;
    }

}));

export default sections;