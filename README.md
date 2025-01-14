# Add custom anime character to your website
This code [AnimeChan.js](https://github.com/Dead-Paul/custom-anime-chan/blob/main/AnimeChan.js) works with your script as module (Exports AnimeChan class by default).

## Important notes
- You need to import the AnimeChan class from plugin to your main JS script;
- You need to add your main script with `type="module"` on your HTML page;
- **Don't forget to use the virtual server or similar environment while testing the workability _(CORS blocked when you trying to start from just file, but you need the CORS)_**

## Easy start
- You can use the [demo.html](https://github.com/Dead-Paul/custom-anime-chan/blob/main/demo.html) file from this repo to see demonstration of abilities of the plugin;
- You can see usage of the AnimeChan class in the [main.js](https://github.com/Dead-Paul/custom-anime-chan/blob/main/demo/js/main.js) script from demo of this repository;
- **Don't forget to use the virtual server or similar environment while testing the workability _(CORS blocked when you trying to start from just file, but you need the CORS because you'll use [main.js](https://github.com/Dead-Paul/custom-anime-chan/blob/main/demo/js/main.js) as script with `type="module"`)_**

## Getting started with class AnimeChan
First things first you need to import AnimeChan class from the [AnimeChan.js](https://github.com/Dead-Paul/custom-anime-chan/blob/main/AnimeChan.js) to the script of yours.

Second things second you need to create instance of the AnimeChan class such as `const animeChan = new AnimeChan();`, and now about parameters for the constructor of the class:

* _String_ **`containerId`** - Id of the container with anime character;

    > Note: It's recommended to use `relative` position of the container with anime chan.

    > Note: Adjusting of the image of the anime chan will be by the size of body picture (it is the base), and it'll be sized by ratio, that calculates automatically by the smallest dimension of the container (`width` or `height`) but if you have no container sized as proportions of your image you can add to the file with styles to the style of id `#your-container-id` variable `--adjust-to` and set value to `"width"` or `"height"`. You can see example of usage in [style.css](https://github.com/Dead-Paul/custom-anime-chan/blob/main/demo/css/style.css).

* _Object_ **`character`** - Character info is object with fields:

  > Note: Here will be example of the filling of the `character` object with objects as parts of the character, but the main thing is, every object **must have** `name of the part`, then `type of the part`, then object with `start position` and `start position` must have an `x` and an `y` as numbers of the position of the layer on the image.

  > Note: You can see an example of the filling in [main.js](https://github.com/Dead-Paul/custom-anime-chan/blob/main/demo/js/main.js).

    * _Object_ **`body`** - Body info about the body images and it`s positions. It must contain:

        * _Object_ **`main`** - Main image (_required in every object of the character_);
            * _String_ **`src`** - Source of the main body image;

              > Note: All images will be a promises, so to work with them you need to use an `await` and `async` or `.then().catch()` syntax.

            * _Object_ **`position`** - Position of the body (left top corner);
                * _Number_ x - X (horizontal) position of the body;
                * _Number_ y - Y (vertical) position of the body;

      > Note: this was all required variables that you must add to each object of the `character`. At first appear of the character on the page (about it later) will be added all `main` images of each `body part`. So if you want to hide some of this you will need to hide it with styles in your code.
    
    * And the other parts with your custom names....

    > Note: hierarchy of adding objects to the `character` such as a `body` will be saved while adding this objects on the page, so be careful with that. 


## Fields of the class instance
- _Object_ **`part`** - Object with all parts of the character and all types of parts of the character;
- _Object_ **`active`** - Contains fields of an active image for every character part;
- _Object_ **`startPosition`** - Contains start positions for all types of all parts of the character;
- _Number_ **`ratio`** - How much bigger or smaller has the image become on the page;
- _String_ **`containerId`** - Id of the container that contains character;
- _Function_ **`setActive(partName : String, partType : String)`** - Sets active part of the main character on another part;
- _Function_ **`setEvents()`** - Sets events on page content load and resize for the character and displays it. 