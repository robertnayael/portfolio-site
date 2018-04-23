const defaultDuration = 1000;
const maxDuration = 4000;
const FPS = 60;
const step = 1 / FPS;

let delta = 0,
    now,
    last = window.performance.now();


class AvatarView {

    constructor(ctx, id, animations, isFirst) {
        this.ctx = ctx;
        this.id = id;
        this.isFirst = isFirst;
        this.direction = -1;
        this.progress = 0; // ms
        this.animations = animations.map(animation => {
            return {
                ...animation,
                delay: (animation.delay ? animation.delay + 1000 : 1000) * 0.001,
                duration: (animation.duration ? animation.duration : defaultDuration) * 0.001,
                currentY: animation.startY,
                targetY: 0
            }
        });
    }

    assignImages(images) {
        this.animations.forEach(({sprite}) => sprite.image = images[sprite.src]);
    }

    animationHasFinished() {
        return false;
    }

    animateForward() {
        this.direction = 1;
    }

    animateReverse() {
        this.direction = -1;
    }

    update(step) {
        this.progress = Math.max(0, Math.min(maxDuration * 0.001, this.progress + (this.direction * step)));

        this.animations.forEach(animation => {
            
            const movementRange = {
                start: animation.startY,
                end: animation.targetY
            };
            const delay = this.direction === 1 ? animation.delay : 0; // no delay for reverse animation
            const pxStep = (movementRange.end - movementRange.start) * ((this.direction * step) / animation.duration);

            if (this.progress >= delay || this.direction === -1) {
                
                let newPos = animation.currentY + pxStep;
                newPos = Math.max(newPos, animation.targetY);
                newPos = Math.min(newPos, animation.startY);
                animation.currentY = newPos;
            }

            if (this.isFirst) {
                animation.currentY = animation.targetY;
            }
        });

        this.isFirst = false;
    }

    getSprites() {
        return this.animations.map(({sprite, currentY}) => ({
            image: sprite.image,
            sX: sprite.x,
            sY: sprite.y,
            sW: sprite.width,
            sH: sprite.height,
            dX: 0,
            dY: currentY,
            dW: sprite.width,
            dH: sprite.height
        }));
    }

}

export default class Avatar {

    constructor(settings) {
        this.canvas = settings.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.baseWidth = settings.width;
        this.baseHeight = settings.height;
        this.scale = 1;
        this.images = [];
        this.imagesLoaded = false;

        this.fgSprite = settings.fgSprite;
        this.bgSprite = settings.bgSprite;

        this.views = [];
        this.activeView = null;
    }

    init() {
        this.preloadImages()
            .then(images => this.assignImages(images))
            .then(() => this.imagesLoaded = true)
            .then(() => this.resizeCanvas())
            .then(() => this.update());
    }

    resizeCanvas() {
        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;
    }

    addView({id, animations, isFirst}) {

        const imageFilenames = animations.map(anim => anim.sprite.src);
        imageFilenames.forEach(filename => 
            this.images.push({filename})
        );

        this.views.push(new AvatarView(this.ctx, id, animations, isFirst));
    }

    assignImages(images) {
        this.fgSprite.image = images[this.fgSprite.src];
        this.bgSprite.image = images[this.bgSprite.src];
        this.views.forEach(view => view.assignImages(images));
    }

    switchView(newView) {
        if (this.activeView === newView) return;
        this.activeView = newView;

        this.views.forEach(view => {

            view.id === newView
                ? view.animateForward()
                : view.animateReverse()

        });

        this.update();
    }

    update() {
        window.requestAnimationFrame(() => {

            if (!this.imagesLoaded) return;
            if (!this.activeView) return;
            if (this.allAnimationsFinished()) return;

            now = window.performance.now();
            delta = delta + Math.min(1, (now - last) / 1000);
            while(delta > step) {
                delta = delta - step;
                this.views.forEach(view => view.update(step));
            }

            last = now;
            this.update();
            this.clearCanvas()
            this.draw();
        });
    }

    draw() {
        const {ctx, bgSprite, fgSprite} = this;

        ctx.drawImage(
            bgSprite.image,
            bgSprite.x, bgSprite.y, bgSprite.width, bgSprite.height
        );

        this.views.forEach(view => {
            view.getSprites().forEach(sprite => {

                ctx.drawImage(
                    sprite.image,
                    sprite.sX, sprite.sY, sprite.sW, sprite.sH,
                    sprite.dX, sprite.dY, sprite.dW, sprite.dH
                )

            })
        });

        ctx.drawImage(
            fgSprite.image,
            fgSprite.x, fgSprite.y, fgSprite.width, fgSprite.height
        );
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);
    }

    allAnimationsFinished() {
        return this.views
            .map(view => view.animationHasFinished())
            .reduce((prev, curr) => prev && curr, true)
    }


    preloadImages() {

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
        const filenames = this.images.reduce((filenames, image) => {
            if (!filenames.includes(image.filename)) filenames.push(image.filename);
            return filenames;
        }, []);

        filenames.push(
            this.fgSprite.src,
            this.bgSprite.src
        );

         // 2. Retrieve images and make sure they are stored with their corresponding filenames
        const images = filenames.map(filename => fetch(filename)
            .then(response => response.blob())
            .then(makeImage)
            .then(image => ({filename, image}))
        );

        // 3. Make a 'dictionary' of images (filename -> image)
        return Promise.all(images)
            .then(images => images.reduce(
                (list, {filename, image}) => {
                    list[filename] = image;
                    return list;
                }, {}
            ))
            .then(images => this.images = images);
    }

}

/*----------------------------------------------------------------*/

