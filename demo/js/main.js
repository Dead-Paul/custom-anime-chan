//@ts-check
// Importing from the plugin
import {AnimeChan, setAnimeChanEvents} from '../../AnimeChan.js';

/** Path for all img sources @type {String}*/
const path = './preview/img/';

/** Anime character @type {AnimeChan}*/
const animeChan = new AnimeChan({
    sclera: { main: { src: path + 'sclera.png', position: { x: 0, y: 0 } } },
    eyes: {
        main: { src: path + 'eyes.png', position: { x: 595, y: 368 } },
        //@ts-ignore : There is no requirement to write this objects in the constructor, but it will not throw error
        love: { src: path + 'eyes-love.png', position: { x: 595, y: 368 }},
        think: { src: path + 'eyes-think.png', position: { x: 595, y: 368 }}
    },
    body: { main: { src: path + 'body.png', position: { x: 0, y: 0 } } },
    mouth: {
        main: { src: path + 'mouth-open.png', position: { x: 695, y: 528 } },
        //@ts-ignore : There is no requirement to write this objects in the constructor, but it will not throw error
        smile: { src: path + 'mouth-smile.png', position: { x: 653, y: 506 } },
        sad: { src: path + 'mouth-sad.png', position: { x: 698, y: 531 } },
    },
});

// Setting animeChan events on load and resize page
setAnimeChanEvents('anime-chan-container', animeChan);