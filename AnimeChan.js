//@ts-check
 
/**
 * Creates new Image
 * @function
 * @param {!String} src - Path to the image
 * @param {?String} id - Id of the image
 * @param {?String} position - CSS style position ('absolute' by default)
 * @returns {Promise<HTMLImageElement|Error>}
 */
function createImage (src, id, position) {
    position = position || 'absolute';
    const img = new Image();
    img.src = src;
    if (id)
        img.setAttribute('id', id);
    img.style.position = position;
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Can\'t load image :('));
    });
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
 * Contains all important info about anime character
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
                this.part[partName][partType] = createImage(character[partName][partType].src, `anime-chan-${partName}`, null);
                this.startPosition[partName][partType].left = `${character[partName][partType].position.x}px`;
                this.startPosition[partName][partType].top = `${character[partName][partType].position.y}px`;
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
     */
    setActive = function (partName, partType) {
        partType = partType || 'main';
        if (this.active[partName] == partType) return;

        this.part[partName][partType]
            .then(/**@param {HTMLImageElement} img */ img => {
                //@ts-expect-error : In the document must be element with id = `anime-chan-${partName}`;
                (document.getElementById(containerId) || document.documentElement).replaceChild(img, document.getElementById(`anime-chan-${partName}`));
                this.active[partName] = partType;
            }).catch(/**@param {Error} error */ error => console.error(error));
    };
}

/**
 * Function that adds events on page load and resize for anime character
 * @param {String} containerId - Id of the container with anime character
 * @param {AnimeChan} animeChan - Anime character
 * @returns Nothing
 */
function setAnimeChanEvents(containerId, animeChan)  {
    ['DOMContentLoaded', 'resize'].forEach(event => window.addEventListener(event, async () => {
        /**
         * Container that will contain anime character
         * @type {HTMLElement}
         */
        const container = document.getElementById(containerId) || document.documentElement;
        ['width', 'height'].forEach(property => container.style.removeProperty(property));
        const
            containerParams = container.getBoundingClientRect(),
            styles = window.getComputedStyle(container),
            minSize = styles.getPropertyValue('--adjust-to')
                ? styles.getPropertyValue('--adjust-to').slice(1, -1)
                : (containerParams.width < containerParams.height) ? 'width' : 'height',
            maxSize = (minSize !== 'width')? 'width' : 'height',
            /**@type {HTMLImageElement} */
            animeChanBodyMainImage = await animeChan.part.body.main
        ;

        animeChan.ratio = animeChanBodyMainImage[addPrefix('natural', minSize)] / containerParams[minSize];
        ['width', 'height'].forEach(prop => {
            Object.keys(animeChan.part).forEach(partName => {
                Object.keys(animeChan.part[partName]).forEach(async (partImage) => {
                    const animeChanPartImage = await animeChan.part[partName][partImage];
                    animeChanPartImage.style[addPrefix('max', prop)] = `${animeChanPartImage[addPrefix('natural', prop)] / animeChan.ratio}px`;
                });
            });
        });

        if (styles.getPropertyValue('--adjust-to'))
            container.style[maxSize] = `${animeChanBodyMainImage[addPrefix('natural', maxSize)] / animeChan.ratio}px`;

        ['top', 'left'].forEach((side) => {
            Object.keys(animeChan.part).forEach((partName) => {
                Object.keys(animeChan.part[partName]).forEach(async (partImage) => {
                    const animeChanPartImage = await animeChan.part[partName][partImage];
                    animeChanPartImage.style[side] = `${parseFloat(animeChan.startPosition[partName][partImage][side]) / animeChan.ratio}px`;
                });
            });
        });

        Object.keys(animeChan.part).forEach(async (partName) => {
            if (animeChan.active[partName]) container.appendChild(await animeChan.part[partName][animeChan.active[partName]]);
        });
    }));
};

export {AnimeChan, setAnimeChanEvents};