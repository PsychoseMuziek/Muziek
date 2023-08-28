/*
 supporting functions for the game, mainly concerning setting up a Browser friendly game loop
*/

var running = false;

function pauseGame() {
    running = false;
}

function createGameLogic(dimensions, settings) {
    return new GameLogic(dimensions.width, dimensions.height, 
        settings.initialLength, settings.loop, settings.startHealth, 
        settings.hpLossPerStep, settings.hpGainPerFood);
}

var previousTime = 0;
var timeElapsedSinceLastUpdate = 0;
var timeDifference = 0;

// works via built-in requestAnimationFrame()
// todo add insert for time check function?
function createGameUpdater(setter, getter, logic) {
    return function(now) {
        timeDifference = now - previousTime;
        previousTime = now;
        timeElapsedSinceLastUpdate += timeDifference;
        // code to go faster?
        if (timeElapsedSinceLastUpdate > 200) {
            timeElapsedSinceLastUpdate = 0;
            let nextState = logic.next(getter());
            setter(nextState);
        }
    };
}

// ms
function getTimeDifference() {
    return timeDifference;
}

function createGameResetter(setter, logic) {
    return function () {
        setter(logic.start());
    }
}

function loseCheckAction(stateGetter, action) {
    return function() {
        if (stateGetter().loseFlag) {
            action();
        }
    }
}
function ateCheckAction(stateGetter, action) {
    return function() {
        if (stateGetter().justAte) {
            action();
            // nasty tricky
            stateGetter().justAte = false;
        }
    }
}
function turnCheckAction(stateGetter, action) {
    return function() {
        if (stateGetter().tookTurn) {
            action();
            stateGetter().tookTurn = false;
        }
    }
}

function createStartFunction(bootStrap, getCurrentTime) {
    return function() {
        running = true;
        previousTime = getCurrentTime();
        requestAnimationFrame(bootStrap);
    }
}

function createGameLoopFunction(gameLoop) {
    let reflectiveFunctionReference;
    reflectiveFunctionReference = function() {
        gameLoop();
        if (running) {
            requestAnimationFrame(reflectiveFunctionReference);
        }
    };
    return reflectiveFunctionReference;
}

function createGameLoopFunction(gameLoop, timeStep) {
    let reflectiveFunctionReference;
    reflectiveFunctionReference = function(msNow) {
        timeStep(msNow);
        gameLoop();
        if (running) {
            requestAnimationFrame(reflectiveFunctionReference);
        }
    };
    return reflectiveFunctionReference;
}

function gameUiDimensionsInit(availableDimension, constants) {
    let result = 50;
    if (availableDimension.width > availableDimension.height) {
        result = availableDimension.height / 20;
    }
    else {
        result = availableDimension.height / 10;
    }
    return   {width: 0, height: result};
}

function gameDimensionsInit(availableDimension, constants) {
    let tileSizeResult, gameWidth, gameHeight;
    if (availableDimension.width > availableDimension.height) {
        gameHeight = constants.minimumTiles;
        tileSizeResult = Math.floor(availableDimension.height / constants.minimumTiles);
        if (constants.preferredTileSize > tileSizeResult) {
            tileSizeResult = constants.preferredTileSize;
            gameHeight = Math.floor(availableDimension.height / tileSizeResult)
        }
        // let the height only be 3/4 of the width
        let preferredWidth = availableDimension.height / (3 / 4);
        preferredWidth = Math.ceil(preferredWidth); // after this operation for the width
        if (preferredWidth > availableDimension.width) {
            gameWidth = Math.floor(availableDimension.width / tileSizeResult);
        }
        else {
            gameWidth = Math.floor(preferredWidth / tileSizeResult);
        }
    }
    else {
        gameWidth = constants.minimumTiles;
        tileSizeResult = Math.floor(availableDimension.width / constants.minimumTiles);
        if (constants.minimumTileSize > tileSizeResult) {
            tileSizeResult = constants.minimumTileSize;
            gameWidth = Math.floor(availableDimension.width / tileSizeResult)
        }
        let preferredHeight = availableDimension.height;
        gameHeight = Math.floor(preferredHeight / tileSizeResult);
    }
    let canvasWidth = tileSizeResult * gameWidth;
    let canvasHeight = tileSizeResult * gameHeight;
    return {
        canvas: {width: canvasWidth, height: canvasHeight},
        //ui: [x,y, widht, heightg],
        game: {width: gameWidth, height: gameHeight},
        tile: {x: tileSizeResult, y: tileSizeResult},
        boardTranslate: {x: 0, y: 0}
    };
}

function createNextSongFunction(options) {
    return function(currentSongName) {
        let result;
        //let formatIndex = currentSongSource.lastIndexOf('.');
        //let format = currentSongSource.substring(formatIndex);
        //let currentSongName = currentSongSource.subString(0, formatIndex);
        do {
            let randomSongIndex = Math.floor(Math.random() * options.length);
            result = options[randomSongIndex];
        }
        while (currentSongName === result);
        
        return result;//.concat(format);
    };
}

// additional game logic to patch holes I suppose

function createHpLoss(getHealth, setHealth, hpLossPerSecond) {
    return function(){
        let current = getHealth();
        let hpLoss = (timeDifference / 1000) * hpLossPerSecond;
        current = current - hpLoss;
        setHealth(current);
    }
}

function createLoseCheckHp(getHealth, getGameState) {
    return function() {
        result = false;
        if (getHealth() <= 0) {
            // tricky
            getGameState().health = 0;
            result = true;
        }
        return result;
    };
}


// currently assumes fixed initial snake starting size
// 200 is about minimum total size?
function createHPBalancer(rules, size) {
    let totalSize = size.width * size.height;
    // duration in second
    return function(duration) {
        let result = 2000;
        result = duration * (rules.hpLossPerSecond / 2);
        let excessSize = totalSize - 200;
        if (excessSize > 0) {
            result = result - (2 * (excessSize ** 1.5));
        }
        return result;
    }
}

function hpWrapper(transformation, getter, setter) {
    return function() {
        let newValue = transformation(getter())
        setter(newValue);
    };
}
