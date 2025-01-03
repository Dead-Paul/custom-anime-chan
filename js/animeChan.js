//@ts-check

const 
    /** Path for all img sources @type {String}*/
    path = './img/anime-chan/',
    /**Id of the container with anime character @type {String}*/
    containerId = 'anime-chan-container'
;
 
/**
 * Creates new Image
 * @function
 * @param {!String} src - Path to Image
 * @param {?String} position - CSS style position ('absolute' by default)
 * @returns {HTMLImageElement}
 */
function createImage (src, position) {
    position = position || 'absolute';
    const img = new Image();
    img.src = src;
    img.style.position = position;
    return img;
};

/**
 * Adds prefix to the word
 * @function
 * @param {String} prefix - Prefix to add
 * @param {String} word - Word to add prefix to
 * @returns {String} - Word with prefix
 */
function addPrefix(prefix, word) {
    return prefix + word.charAt(0).toUpperCase() + word.slice(1);
};


/**
 * Contains all important info about Anime character
 * @class
 *
 * @property {function} setActive - Sets active part of the main character on another part
 */
class AnimeChan {
    /**
     * All important info about anime character (all fields with 'Src' in the end of the name counts as src for images)
     * @constructor
     *
     * @param {Object} character - Character info
     * @param {Object} character.body - Body info
     * @param {Object} character.body.main - Main body image
     * @param {String} character.body.main.src - Source of the main body image
     * @param {Object} character.body.main.position - Position of the body (left top corner)
     * @param {Number} character.body.main.position.x - X (horizontal) position of the body
     * @param {Number} character.body.main.position.y - Y (vertical) position of the body
     *
     * @param {Object} character.sclera - Sclera info
     * @param {Object} character.sclera.main - Main sclera image
     * @param {String} character.sclera.main.src - Source of the main sclera image
     * @param {Object} character.sclera.main.position - Position of the sclera (left top corner)
     * @param {Number} character.sclera.main.position.x - X (horizontal) position of the sclera
     * @param {Number} character.sclera.main.position.y - Y (vertical) position of the sclera
     *
     * @param {Object} character.eyes - Eyes info (pupil and glare)
     * @param {Object} character.eyes.main - Main eyes image
     * @param {String} character.eyes.main.src - Source of the main eyes image
     * @param {Object} character.eyes.main.position - Position of the eyes (left top corner)
     * @param {Number} character.eyes.main.position.x - X (horizontal) position of the eyes
     * @param {Number} character.eyes.main.position.y - Y (vertical) position of the eyes
     *
     * @param {Object} character.mouth - Mouth info (pupil and glare)
     * @param {Object} character.mouth.main - Main mouth image
     * @param {String} character.mouth.main.src - Source of the main mouth image
     * @param {Object} character.mouth.main.position - Position of the mouth (left top corner)
     * @param {Number} character.mouth.main.position.x - X (horizontal) position of the mouth
     * @param {Number} character.mouth.main.position.y - Y (vertical) position of the mouth
     */
    constructor(character) {
        /**
         * Parts info
         * @type {Object}
         *
         * @property {Object} part.body - Body info
         * @property {HTMLImageElement} part.body.main - Source of the main body image (Necessarily)
         *
         * @property {Object} part.sclera - Sclera info
         * @property {HTMLImageElement} part.sclera.main - Source of the main sclera image (Necessarily)
         *
         * @property {Object} part.eyes - Eyes info (pupil and glare)
         * @property {HTMLImageElement} part.eyes.main - Source of the main eyes image (Necessarily)
         *
         * @property {Object} part.mouth - Eyes info (pupil and glare)
         * @property {HTMLImageElement} part.mouth.main - Source of the main eyes image (Necessarily)
         *
         */
        this.part = Object();
        /**
         * Contains fields of active image for every character part
         * @type {Object}
         */
        this.active = Object();
        /**
         * Contains start positions for all types of all parts of the character
         * @type {Object}
         */
        this.startPosition = Object();
        Object.keys(character).forEach((partName) => {
            this.part[partName] = Object();
            this.active[partName] = 'main';
            this.startPosition[partName] = Object();
            Object.keys(character[partName]).forEach((partType, i) => {
                this.startPosition[partName][partType] = Object();
                this.part[partName][partType] = createImage(character[partName][partType].src, null);
                this.startPosition[partName][partType].left = this.part[partName][partType].style.left = `${character[partName][partType].position.x}px`;
                this.startPosition[partName][partType].top = this.part[partName][partType].style.top = `${character[partName][partType].position.y}px`;
                this.part[partName][partType].setAttribute('id', `anime-chan-${partName}`);
            });
        });
        /**
         * How much bigger or smaller has the image become on the page
         * @type {Number}
         */
        this.ratio = 1;
    }

    /**
     * Sets active part of the main character on another part
     * @function
     * @memberof AnimeChan
     * @param {!String} partName - Part of th character that you want to change
     * @param {?String} partType - Name of the part type ('main' by default)
     * @returns {boolean} - Success or failure
     */
    setActive = function (partName, partType) {
        partType = partType || 'main';
        try {
            if (this.active[partName] == partType) return false;

            this.active[partName] = partType;
            (document.getElementById(containerId) || document.documentElement).replaceChild(
                this.part[partName][partType],
                document.getElementById(`anime-chan-${partName}`) || document.createElement('img')
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}

/** Anime character @type {AnimeChan}*/
globalThis.animeChan = new AnimeChan({
    sclera: { main: { src: path + 'sclera.png', position: { x: 0, y: 0 } } },
    eyes: { main: { src: path + 'eyes.png', position: { x: 595, y: 368 } } },
    body: { main: { src: path + 'body.png', position: { x: 0, y: 0 } } },
    mouth: {
        main: { src: path + 'opened-mouth.png', position: { x: 695, y: 528 } },
        //@ts-expect-error
        smile: { src: path + 'smile.png', position: { x: 653, y: 506 } },
        sad: { src: path + 'sad.png', position: { x: 698, y: 531 } },
    },
});

['DOMContentLoaded', 'resize'].forEach((event) =>
    window.addEventListener(event, () => {
        /**
         * Container that will contain anime character
         * @type {HTMLElement}
         */
        const container = document.getElementById(containerId) || document.documentElement;
        container.setAttribute('style', '');
        const
            containerParams = container.getBoundingClientRect(),
            styles = window.getComputedStyle(container),
            minSize = styles.getPropertyValue('--adjust-to')
                ? styles.getPropertyValue('--adjust-to').slice(1, -1)
                : (containerParams.width < containerParams.height) ? 'width' : 'height',
            maxSize = (minSize !== 'width')? 'width' : 'height';

        animeChan.ratio = animeChan.part.body.main[addPrefix('natural', minSize)] / containerParams[minSize];
        ['width', 'height'].forEach((prop) => {
            Object.keys(animeChan.part).forEach((partName) => {
                Object.keys(animeChan.part[partName]).forEach((partImage) => {
                    animeChan.part[partName][partImage].style[addPrefix('max', prop)] = (
                        `${animeChan.part[partName][partImage][addPrefix('natural', prop)] / animeChan.ratio}px`
                    );
                });
            });
        });

        if (styles.getPropertyValue('--adjust-to')) {
            container.style[maxSize] = animeChan.part.body.main.style[addPrefix('max', maxSize)];
        }

        ['top', 'left'].forEach((side) => {
            Object.keys(animeChan.part).forEach((partName) => {
                Object.keys(animeChan.part[partName]).forEach((partImage) => {
                    animeChan.part[partName][partImage].style[side] = `${parseFloat(animeChan.startPosition[partName][partImage][side]) / animeChan.ratio}px`;
                });
            });
        });

        Object.keys(animeChan.part).forEach((partName) => {
            if (animeChan.active[partName]) container.appendChild(animeChan.part[partName][animeChan.active[partName]]);
        });
    })
);
