// https://stackoverflow.com/questions/29018151/how-do-i-programmatically-create-a-touchevent-in-chrome-41
function dispatchTouchEvent(x, y, element, eventType) {
  let touchObj = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: x,
    clientY: y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });
  
  let fakeTouchObj01 = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: x + 100,
    clientY: y + 100,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });
  
  let fakeTouchObj02 = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: x + 100,
    clientY: y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });
  
  let fakeTouchObj03 = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: x,
    clientY: y + 100,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });

  const touchEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj, fakeTouchObj01, fakeTouchObj02, fakeTouchObj03],
    targetTouches: [],
    changedTouches: [touchObj],
    shiftKey: true,
  });

  element.dispatchEvent(touchEvent);
}

function centroid(touches) {
  var p = { x:0, y:0 }
  for (var i = touches.length - 1; i >= 0; i--) {
    p.x += touches[i].clientX;
    p.y += touches[i].clientY;
  }
  p.x /= touches.length;
  p.y /= touches.length;
  
  return p;
}

function routeMouseToTouches(element) {
  element.addEventListener('mousemove', function(e) {
    dispatchTouchEvent(e.clientX, e.clientY, app.view, "touchmove");
  });
}

module.exports = { routeMouseToTouches, centroid }