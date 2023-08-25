// All the audio/visual code

var tileDraw;
var snakeGraphic;

function createDrawBoardBackground(display, graphics) {
    return function() {
        let resourceArgument = {width: graphics.width, height: graphics.height}
        display.fill(graphics.resource, resourceArgument);
    };
}

function createDrawImageBackground(display, graphics) {
    return function() {
        let resourceArgument = {width: graphics.width, height: graphics.height}
        display.fitImage(graphics.resource, resourceArgument);
    };
}

function createDrawSnake(display, stateGetter, graphics) {
    return function() {
        let snakeData = stateGetter().snake;
        for (let i = 0; i <= snakeData.length - 1; i++) {
            let x = snakeData[i][0];
            let y = snakeData[i][1];
            if (i === snakeData.length - 1) {
               display.drawTile(x,y, graphics.head);
            }
            else {
                display.drawTile(x,y, graphics.body);
            }
        }
    };
}

function createDrawFood(display, stateGetter, graphics) {
    return function() {
        let x = stateGetter().food[0];
        let y = stateGetter().food[1];
        display.drawTile(x, y, graphics);
    };
}

class UiDrawStepConstructor {
    constructor(drawHelper, stateGetter){
        this.display = drawHelper;
        this.stateGetter = stateGetter;
        // not the game state right now, but unique object for duration and p-health
    }

    background(graphics) {
        return function() {
            this.display.fill(graphics.resource, graphics.width, graphics.height);
        };
    }

    health(graphics) { 
        return function() {
            this.display;
            graphics.fullHealthColor
            , emptyHealthColor
            graphics.icon
        };
    }

    timer(graphics) {
        return function() {
            this.display;
            graphics.fullHealthColor
            , emptyHealthColor
            graphics.icon
        };
    }
}

function audioPlayer(audioDatabase, resourceName) {
    return function() {
        audioDatabase.get(resourceName).play();
    }
}

function audioPause(audioDatabase, resourceName) {
    return function() {
        audioDatabase.get(resourceName).pause();
    }
}

function audioDuration(audioDatabase, resourceName) {
    return function() {
        return audioDatabase.get(resourceName).duration;
    }
}

function audioSetPlaybackRate(audioDatabase, resourceName) {
    return function(rate) {
        audioDatabase.get(resourceName).playbackRate  = rate;
    }
}

function audioEnded(audioDatabase, resourceName) {
    return function() {
        if (audioDatabase.get(resourceName).currentTime > 0) {
            return audioDatabase.get(resourceName).ended;
        }
        return false;
    }
}

function audioCurrentTime(audioDatabase, resourceName) {
    return function() {
        return audioDatabase.get(resourceName).currentTime;
    }
}
