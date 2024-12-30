/**
 * Creates new Image
 * @function
 * @param {!String} src - Path to Image
 * @param {?String} position - CSS style position ('absolute' by default) 
 * @returns {Image}
 */
const createImage = (src, position = 'absolute') => {
    const img = new Image();
    img.src = src;
    img.style.position = position;
    return img;
};

/**
 * Contains all important info about Anime character
 * @class 
 * @constructor
 * @property {Object} part - Parts info
 * @property {Object} part.body - Body info
 * @property {Image} part.body.mainSrc - Source of the main body image
 * 
 * @property {Object} part.sclera - Sclera info
 * @property {String} part.sclera.mainSrc - Source of the main sclera image
 * 
 * @property {Object} part.eyes - Eyes info (pupil and glare)
 * @property {String} part.eyes.mainSrc - Source of the main eyes image
 * 
 * @property {Number} ratio - How much bigger or smaller has the image become on the page
 * @property {Object} activeSrc - Contains fields of active image sources for every character part
 */
class AnimeChan {
    /**
     * All important info about anime character (all fields with 'Src' in the end of the name counts as src for images)
     * @param {Object} character - Character info
     * @param {Object} character.body - Body info
     * @param {String} character.body.mainSrc - Source of the main body image
     * 
     * @param {Object} character.sclera - Sclera info
     * @param {String} character.sclera.mainSrc - Source of the main sclera image
     * @param {Object} character.sclera.position - Position of the sclera (left top corner)
     * @param {Number} character.sclera.position.x - X (horizontal) position of the sclera
     * @param {Number} character.sclera.position.y - Y (vertical) position of the sclera
     * 
     * @param {Object} character.eyes - Eyes info (pupil and glare)
     * @param {String} character.eyes.mainSrc - Source of the main eyes image
     * @param {Object} character.eyes.position - Position of the eyes (left top corner)
     * @param {Number} character.eyes.position.x - X (horizontal) position of the eyes
     * @param {Number} character.eyes.position.y - Y (vertical) position of the eyes
     */
    constructor(character) {
        this.part = Object();
        this.activeSrc = Object();
        Object.keys(character).forEach(partName => {
            this.part[partName] = Object();
            this.activeSrc[partName] = 'mainSrc';
            Object.keys(character[partName]).forEach((partImage, i) => {
                if (partImage.endsWith('Src')) {
                    this.part[partName][partImage] = createImage(character[partName][partImage]);
                    if (Object.keys(character[partName]).indexOf('position') > -1) {
                        this.part[partName][partImage].style.left = `${character[partName].position.x}px`;    
                        this.part[partName][partImage].style.top = `${character[partName].position.y}px`;
                    this.part[partName][partImage].setAttribute('id', `anime-chan-${partName}`);
                    }
                }
            });
        });
        this.ratio = 1;
    };
};

const 
    /**
     * Path for all img sources
     * @type {String}
     */
    path = './img/anime-chan/',
    /**
     * Anime character
     * @type {AnimeChan}
     */
    animeChan = new AnimeChan({
        sclera: {mainSrc : path + 'sclera.png', position : {x: 0, y:0}},
        eyes: {mainSrc : path + 'eyes.png', position : {x: 595, y: 368}},
        body: {mainSrc : path + 'body.png'},
        mouth: {mainSrc : path + 'smile.png', position : {x: 653, y: 506}}
    });

['DOMContentLoaded', 'resize'].forEach(type => window.addEventListener(type, () => {
    /**
     * Container that will contain anime character
     * @type {HTMLElement}
     */
    const container = document.getElementById('anime-chan-container') || document.documentElement,
    containerParams = container.getBoundingClientRect(),
    setSize = containerParams.width < containerParams.height? 'width' : 'height';
    removeSize = setSize == 'height'? 'width' : 'height';

    animeChan.ratio = animeChan.part.body.mainSrc[setSize] / containerParams[setSize];
    Object.keys(animeChan.part).forEach(partName => {
        Object.keys(animeChan.part[partName]).forEach(partImage => {
            animeChan.part[partName][partImage].style[setSize] = 
                `${animeChan.part[partName][partImage][setSize] / animeChan.ratio}px`;
            animeChan.part[partName][partImage].style.removeProperty(removeSize);
        });
    });
    ['top', 'left'].forEach(side => {
        Object.keys(animeChan.part).forEach(partName => {
            Object.keys(animeChan.part[partName]).forEach(partImage => {
                animeChan.part[partName][partImage].style[side] = 
                    `${parseFloat(animeChan.part[partName][partImage].style[side]) / animeChan.ratio}px`;
            });
        });
    });

    Object.keys(animeChan.part).forEach(partName => {
        if (animeChan.activeSrc[partName])
            container.appendChild(animeChan.part[partName][animeChan.activeSrc[partName]]);
    });
}));