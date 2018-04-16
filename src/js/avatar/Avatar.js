//const getViewportHeight = () => window.innerHeight;
//const getSectionHeight = (sectionId) => parseInt(window.getComputedStyle(document.getElementById(sectionId)).height, 10);


export default class Avatar {

    constructor(settings) {
        this.canvas = settings.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.baseWidth = settings.width;
        this.baseHeight = settings.height;
        this.scale = 1;
        this.sprites = [];
        this.imagesLoaded = false;

        this.resizeCanvas();

        //window.addEventListener('resize', this.resizeCanvas.bind(this));
        window.addEventListener('scroll', this.update.bind(this));
    }

    resizeCanvas() {
        // const height = Math.min(getViewportHeight(), this.baseHeight),
        //       scale = height / this.baseHeight,
        //       width = this.baseWidth * scale;
        // this.canvas.width = width;
        // this.canvas.height = height;
        // this.scale = scale;

        //this.update();

        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;
    }

    addSprite(spritesheet) {

        class Sprite {
            constructor(spritesheet) {
                this.spritesheet = spritesheet;
                this.range = {};
            }

            position(pos) {
                this.position = pos;
                return this;
            }

            progression(range) {
                this.range.progression = range;
                return this;
            }

            visibility(range) {
                this.range.visibility = range;
                return this;
            }

            get src() {
                return this.spritesheet.src;
            }

            isVisible(scrollPos) {
                if (!this.range.visibility) return true;
                const range = this.range.visibility instanceof Function
                    ? this.range.visibility()
                    : this.range.visibility;
                return scrollPos >= range.start && scrollPos <= range.end;
            }

            getPosition(scrollPos) {
                if (!this.isVisible(scrollPos)) return false;

                const byScrollProgress = (valueRange) => {
                    if (!(valueRange instanceof Array)) return valueRange;
                    const [valueStart, valueEnd] = valueRange;
                    const scrollRange = this.range.progression instanceof Function
                        ? this.range.progression()
                        : this.range.progression;

                    const distance = scrollRange.end - scrollRange.start;
                    const distanceCovered = scrollPos - scrollRange.start;
                    const scrollProgress = Math.max(Math.min(distanceCovered / distance, 1), 0);

                    return valueStart + (valueEnd - valueStart) * scrollProgress;
                }

                return {
                    x: byScrollProgress(this.position.x),
                    y: byScrollProgress(this.position.y)
                }
            }

            draw(ctx, scale, scrollPos) {
                const position = this.getPosition(scrollPos);
                if (position === false) return false;

                const s = this.spritesheet;

                ctx.drawImage(
                    this.image,
                    s.x, s.y, s.width, s.height,
                    position.x * scale, position.y * scale, s.width * scale, s.height * scale
                );
            }
        }

        const sprite = new Sprite(spritesheet);
        this.sprites.push(sprite);
        return sprite;

    }

    preloadSprites() {

        const makeImage = (blob) => {
            const url = URL.createObjectURL(blob);
            const image = new Image();
            image.src = url;

            /* For some reason images retrieved by fetch() don't seem to be actually loaded
             * right when the resulting promise is resolved (checked in: Chromium 64.0.3282.143).
             * This listener makes sure to take care of that. */
            return new Promise((resolve, reject) => {
                image.addEventListener('load', () => resolve(image));
            });
        };

        // 1. Get unique filenames of images
        const filenames = this.sprites.reduce((filenames, sprite) => {
            if (!filenames.includes(sprite.src)) filenames.push(sprite.src);
            return filenames;
        }, []);

        // 2. Retrieve images and make sure they are stored with their corresponding filenames
        const images = filenames.map(filename => fetch(filename)
            .then(response => response.blob())
            .then(makeImage)
            .then(image => ({filename, image}))
        );

        // 3. Make a 'dictionary' of images (filename -> image) and assign each sprite object with
        // its corresponding image
        return Promise.all(images)
            .then(images => images.reduce(
                (list, {filename, image}) => {
                    list[filename] = image;
                    return list;
                }, {}
            ))
            .then(images => this.sprites.forEach(sprite => sprite.image = images[sprite.src]));
    }

    init() {
        this.preloadSprites()
        .then(() => this.imagesLoaded = true)
        .then(() => this.update());
    }

    update() {
        if (!this.imagesLoaded) return;
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);
        this.sprites.forEach(sprite => sprite.draw(this.ctx, this.scale, scrollPos));
    }

}

/*----------------------------------------------------------------*/

