// Misc.

function createCompoundAction(actions) {
    return function() {
        actions.forEach(action => {
            action();
        });
    }
}

function createConditionalAction(action, condition) {
    return function() {
        if (condition()) {
            action();
        }
    }
}

function preserveAspectRatio2DFillCentered(container, item) {
    let xScale = container.width / item.width;
    let yScale = container.height / item.height;
    let newWidth = yScale * item.width;
    let newHeight = xScale * item.height;
    if (newWidth > container.width) {
        yScale = xScale;
    }
    if (newHeight > container.height) {
        xScale = yScale;
    }
    let scaleFactor = xScale; // should always be correct;
    newWidth = scaleFactor * item.width;
    newHeight = scaleFactor * item.height;
    let xPos = 0;
    let yPos = 0;
    if (newWidth < container.width) {
        xPos = (container.width - newWidth) / 2;
    }
    else {
        yPos = (container.height - newHeight) / 2;
    }
    return {offsetX: xPos, offsetY: yPos, width: newWidth, height: newHeight};
}
