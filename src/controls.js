
function attachControls(targets, getter, setter) {
    let controlUp = function() {
        setter(inputUp(getter()));
    }
    let controlDown = function() {
        setter(inputDown(getter()));
    }
    let controlRight = function() {
        setter(inputRight(getter()));
    }
    let controlLeft = function() {
        setter(inputLeft(getter()));
    }

    // test if exists
    targets.clickable.up.addEventListener("click", controlUp);
    targets.clickable.down.addEventListener("click", controlDown);
    targets.clickable.left.addEventListener("click", controlLeft);
    targets.clickable.right.addEventListener("click", controlRight);
    //test if it exists
    targets.keyElement.addEventListener("keydown", (event) => {
            var e = event.key.toLowerCase();
            if (e === "w" || e === "arrowup") {
            controlUp();
            }
            if (e === "s" || e === "arrowdown") {
            controlDown();
            }
            if (e === "d" || e === "arrowright") {
            controlRight();
            }
            if (e === "a" || e === "arrowleft") {
            controlLeft();
            }
        },
        false
        );
    // test if it exists
    let swipeControlsBridge = new SwipeHandler(controlUp, controlRight, controlDown, controlLeft);
    targets.swipeArea.addEventListener("touchstart", swipeControlsBridge.handleTouchStart, false);
    targets.swipeArea.addEventListener("touchmove", swipeControlsBridge.handleTouchMove, false);
}

var selfRemovingActions = new Map();

function attachGroupSelfRemovingAction(target, action, groupTag) {
    let singleUseAction;
    singleUseAction = function(event){
        action();
        removeActions(groupTag);
    } ;
    target.domObject.addEventListener(target.event, singleUseAction);
    let removeAction = function() {
        target.domObject.removeEventListener(target.event, singleUseAction);
    }
    addSelfRemovingActionGroupMember(removeAction, groupTag);
}

function addSelfRemovingActionGroupMember(removeAction, groupTag) {
    let current = selfRemovingActions.get(groupTag);
    if (current === null || current === undefined) {
        selfRemovingActions.set(groupTag, [removeAction]);
    }
    else {
        current.push(removeAction);
    }
}

function removeActions(groupTag) {
    removalActions = selfRemovingActions.get(groupTag);
    removalActions.forEach(action => {
        action();
    });
    selfRemovingActions.set(groupTag, null);
}

// unused prolly
function attachSelfRemovingAction(target, action) {
    let selfRemovingAction;
    selfRemovingAction = function(event){
        action();
        target.domObject.removeEventListener(target.event, selfRemovingAction)
    } ;
    target.domObject.addEventListener(target.event, selfRemovingAction);
}
