// -- Snake Game script --
// Source code based on https://github.com/tlhaeroglu/snake-game-mobilesupport
// by Talha Eroglu
// modified by Elwin Slokker (Broeder Konijn)

class GameLogic {
    constructor(width, height, initialLength, loop, startHealth, 
      hpLossPerStep, hpGainPerFood) {
        this.width = width;
        this.height = height;
        this.initialLength = initialLength;
        this.loop = loop;
        this.startHealth = startHealth;
        this.hpLossPerStep = hpLossPerStep;
        this.hpGainPerFood = hpGainPerFood;
    }

    // returns a fresh game state object
    start() {
        // determine first what direction is preferable
        let initialDirection;
        let startSnake = [];
        let startX = Math.floor(this.width / 4);
        let startY = Math.floor(this.height / 4);
        // snake is generated based on prefered direction
        if (this.width >= this.height) {
            initialDirection = 1;
            let middle = Math.floor(this.width / this.initialLength);
            let current = startX - middle;
            for (let i = 0; i < this.initialLength; i++) {
                startSnake.push([current,startY]);
                current++;
            }
        }
        else {
            initialDirection = 2;
            let middle = Math.floor(this.height / this.initialLength);
            let current = startY - middle;
            for (let i = 0; i < this.initialLength; i++) {
                startSnake.push([startX,current]);
                current++;
            }
        }
        let setup = {
            snake: startSnake,
            direction: initialDirection,
            health: this.startHealth,
            justAte: false,
            loseFlag: false
        }
        setup.food = this.randomFreeTile(setup);
        return setup;
    }

    next(gameState) {
        if (gameState.loseFlag) {
            // don't change a lost game: pointless
            return gameState;
        }
        if (gameState.justAte) {
            gameState.justAte = false;
        }
        let newSnakePosition = this.nextPosition(gameState);
        let newState = deepCloneState(gameState)
        if (this.loseCheck(gameState, newSnakePosition.x, newSnakePosition.y)) {
            newState.loseFlag = true;
            return newState;
        }

        newState.snake.push([newSnakePosition.x, newSnakePosition.y]);
        // food check
        if (newSnakePosition.x == gameState.food[0] && 
            newSnakePosition.y == gameState.food[1]) {
            // generate new food within game bounds (after changing the game state already)
            newState.health = gameState.health + this.hpGainPerFood;
            newState.justAte = true;
            newState.food = this.randomFreeTile(newState);
        }
        else {
            //normal, nothing happens path
            newState.snake.shift();
        }
        let newHealth = gameState.health - this.hpLossPerStep;
        if (newHealth <= 0) {
            newState.loseFlag = true;
        }
        newState.health = newHealth;
        return newState;
    }

    // internal use only
    loseCheck(gameState, checkX, checkY) {
        let result = false;
        if (!this.loop) {
            if (checkX < 0 || checkY < 0 || checkX >= this.width || checkY >= this.height)
            {
                result = true;
            }
        }
        // exception, if snake length is < 5, skip self check, otherwise, start checking from index 3
        if (gameState.snake.length > 4) {
            for (let i = gameState.snake.length - 4; i > -1; i--) {
                if (checkX === gameState.snake[i][0] && checkY === gameState.snake[i][1]) {
                    result = true;  
                }
            }
        }
        return result;
    }

    nextPosition(gameState) {
        let snakeHeadIndex = gameState.snake.length - 1;
        let snakePosition = {x: gameState.snake[snakeHeadIndex][0],
                             y: gameState.snake[snakeHeadIndex][1]};
        let newSnakePosition = addDirection(gameState.direction, snakePosition);
        if (this.loop) {
            newSnakePosition = wrapPosition(newSnakePosition, this.width, this.height);
        }
        //check position with snake function
        let neck = gameState.snake[snakeHeadIndex - 1];
        // are we taking the same position as the 'neck'?: invalid direction
        if (newSnakePosition.x === neck[0] && newSnakePosition.y === neck[1]) {
            gameState.direction = inverseDirection(gameState.direction);
            newSnakePosition = addDirection(gameState.direction, snakePosition);
            if (this.loop) {
                newSnakePosition = wrapPosition(newSnakePosition, this.width, this.height);
            }
        }
        return newSnakePosition;
    }

    randomFreeTile(gameState) {
        let tileX = Math.floor(Math.random() * this.width);
        let tileY = Math.floor(Math.random() * this.height);
        let result = [tileX, tileY];
        for (let i = 0; i < gameState.snake.length; i++) {
            if (gameState.snake[i][0] === tileX && 
                gameState.snake[i][1] === tileY) {
                result = randomFreeTile(gameState);
                break;
            }
        }
        return result;
    }
}

function wrapPosition(position, width, height) {
    let result = {x: position.x, y: position.y};
    if (position.x === width) {
        result.x = 0;
    }
    if (position.x < 0) {
        result.x = width;
    }
    if (position.y === height) {
        result.y = 0;
    }
    if (position.y < 0) {
        result.y = height;
    }
    return result;
}

function addDirection(direction, position) {
    let result = {x: position.x, y: position.y};
    switch(direction){
      case 0:
        result.y = position.y - 1;
        break;
      case 1:
        result.x = position.x + 1;
        break;
      case 2:
        result.y = position.y + 1;
        break;
      case 3:
        result.x = position.x - 1;
        break;
    }
    return result;
}

function inverseDirection(direction) {
    let result = -1;
    switch(direction){
      case 0:
        result = 2;
        break;
      case 1:
        result = 3;
        break;
      case 2:
        result = 0;
        break;
      case 3:
        result = 1;
        break;
    }
    return result;
}

function inputUp(gameState) {
    let newState = deepCloneState(gameState);
    newState.direction = 0;
    return newState;
}
function inputRight(gameState) {
    let newState = deepCloneState(gameState);
    newState.direction = 1;
    return newState;
}
function inputDown(gameState) {
    let newState = deepCloneState(gameState);
    newState.direction = 2;
    return newState;
}
function inputLeft(gameState) {
    let newState = deepCloneState(gameState);
    newState.direction = 3;
    return newState;
}

function deepCloneState(gameState) {
    let snakeClone = [];
    for (let i = 0; i < gameState.snake.length; i++) {
        snakeClone.push(gameState.snake[i]);
    }
    let result = { 
        snake: snakeClone,
        food: [gameState.food[0], gameState.food[1]],
        direction: gameState.direction,
        health: gameState.health,
        justAte: gameState.justAte,
        loseFlag: gameState.loseFlag
    };
    return result;
}
