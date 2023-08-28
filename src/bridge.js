/*
    Contains functions that deal directly with HTML DOM manipulation
*/

class BoardDisplay {
    constructor(drawTarget, configuration){
        this.context = drawTarget;
        this.width = configuration.canvasWidth; //fixed for offset
        this.height = configuration.canvasHeight; //fixed for offset
        this.tileWidth = configuration.tileWidth;
        this.tileHeight = configuration.tileHeight;
        this.offsetX = configuration.offsetX;
        this.offsetY = configuration.offsetY;
        this.fitFunction = configuration.fitFunction;
        this.isLandscape = (this.width > this.height);
    }

    drawTile(tileX, tileY, resource) {
        this.context.beginPath();
        let realX = tileX * this.tileWidth + this.offsetX;
        let realY = tileY * this.tileHeight + this.offsetY;
        this.context.drawImage(resource, realX, realY,
             this.tileWidth, this.tileHeight);
        this.context.stroke();
    }

    fill(resource, resourceInformation) {
        this.context.beginPath();
        this.context.drawImage(resource, this.offsetX, this.offsetY, 
            resourceInformation.width, resourceInformation.height);
            //context.drawImage(img, clipx, clipy, clippedwidth, clippedheight, x, y, width, height)
        this.context.stroke();
    }

    fitImage(resource, resourceInformation) {
        let drawParams = this.fitFunction({
                width: this.width,
                height: this.height
            }, {
                width: resourceInformation.width,
                height: resourceInformation.height
            });
        let posX = this.offsetX + drawParams.offsetX;
        let posY = this.offsetY + drawParams.offsetY;
        let scaledWidth = drawParams.width;
        let scaledHeight = drawParams.width;
        this.context.beginPath();
        this.context.drawImage(resource, posX, posY, scaledWidth, scaledHeight);
        this.context.stroke();
    }
}

class UiDisplay {
    constructor(drawTarget, configuration){
        this.context = drawTarget;
        this.width = configuration.canvasWidth; //fixed for offset
        this.height = configuration.canvasHeight; //fixed for offset
        this.offsetX = configuration.offsetX;
        this.offsetY = configuration.offsetY;
    }

    fill() {
        const patternLength = 80;
        this.context.save();
        let gradient = this.context.createLinearGradient(70, 50, 50, 0);
        gradient.addColorStop(0, "grey");
        gradient.addColorStop(0.5, "white");
        gradient.addColorStop(1, "grey");
        this.context.fillStyle = gradient;
        let iterations = Math.ceil(this.width / patternLength);
        for (let i = 0; i < iterations; i++) {
            this.context.fillRect(i * patternLength + this.offsetX,
                 this.offsetY, patternLength, this.height);
        }
        this.context.restore();
    }

    drawMeterBackground(resource, offset) {

    }

    drawIcon(resource, layout) {
        
        this.context.drawImage(resource, 
            layout.x + this.offsetX, layout.y + this.offsetY, 
            layout.size, layout.size);
        
    }
        
    drawBar(resource, layout, currentSize) {
        this.context.save();
        this.context.fillStyle = "grey";
        this.context.fillRect(layout.x  + this.offsetX, layout.y + this.offsetY,
             layout.width, layout.height); // backdrop
        this.context.fillStyle = "red";
        this.context.fillRect(layout.x  + this.offsetX, layout.y + this.offsetY,
             currentSize, layout.height); // filled part
        this.context.restore();
    }
}

function createFrameStart(drawTarget, width, height) {
    return function() {
        drawTarget.clearRect(0, 0, width, height);
    };
}

function rotatedDraw(drawingContext, drawTask, transformation) {
    drawingContext.save();
    drawingContext.translate(transformation.originX, 
                             transformation.originY);
    drawingContext.rotate(transformation.rotationAngle);
    drawingContext.translate(-transformation.rotationalX,
                             -transformation.rotationalY);
    drawTask(drawingContext);
    drawingContext.restore();
}

function msDelayParallelAction(action, delay) {
    return function() {setTimeout(action, delay)};
}

var xDown = null;
var yDown = null;

function getTouches(event) {
    return (
        event.touches || // browser API
        event.originalEvent.touches
    ); // jQuery
}

class SwipeHandler {

    constructor(up, right, down, left) {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.xDown = null;
        this.yDown = null;
    }

    handleTouchStart(event) {
        const firstTouch = getTouches(event)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }
      
    handleTouchMove(event) {
        if (!xDown || !yDown) {
            return;
        }
    
        var xUp = event.touches[0].clientX;
        var yUp = event.touches[0].clientY;
    
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
    
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                this.left();
            } else {
                this.right();
            }
        } else {
            if (yDiff > 0) {
                this.up();
            } else {
                this.down();
            }
        }
        xDown = null;
        yDown = null;
    }
}

function setCanvasSize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}

function currentMsTime() {
    return performance.now();
}
