const PIXI = require("pixi.js"),
      pixiFilters = require("pixi-filters"),
      common = require("./common"),
      curve = require("./curve"),
      timeline = require("./timeline"),
      blurFilter = new PIXI.filters.BlurFilter(),
      glitchFilter = new pixiFilters.GlitchFilter(),
      motionBlurFilter = new pixiFilters.MotionBlurFilter();
      
blurFilter.blur = 0;
blurFilter.quality = 1;
motionBlurFilter.kernelSize = 45;
glitchFilter.enabled = false
glitchFilter.slices = 50

//// overlay ////
function sideRuler(x, y) {
  var sprite = new PIXI.Sprite.fromImage('image/microfilm/ruler-side.png');
  sprite.texture.baseTexture.on('loaded', function(){
    sprite.pivot.x = 0;
    sprite.pivot.y = sprite.height / 2;
    sprite.x = x;
    sprite.y = y;
  });
  return sprite;
}

function bottomRuler(x, y) {
  var sprite = new PIXI.Sprite.fromImage('image/microfilm/ruler-bottom.png');
  sprite.texture.baseTexture.on('loaded', function(){
    sprite.pivot.x = sprite.width / 2;
    sprite.pivot.y = 0;
    sprite.x = x;
    sprite.y = y;
  });
  return sprite;
}



//// dust + scratches ////

function newDust(s, x, y, scale, rotation) {
  var sprite = new PIXI.Sprite.fromImage('image/dust/' + s + '.jpg');
  sprite.x = x;
  sprite.y = y;
  sprite.texture.baseTexture.on('loaded', function(){
    sprite.scale.x = scale;
    sprite.scale.y = scale;
    sprite.pivot.x = sprite.width / 2 / scale;
    sprite.pivot.y = sprite.height / 2 / scale;
    sprite.rotation = rotation;
  });
  sprite.filters = [new PIXI.filters.AlphaFilter()];
  sprite.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;
  return sprite;
}


//// motion blur ////

function move(obj, prop, value, speed) {
  var direction = Math.sign(value - obj[prop]);
  speed *= direction;
  return function(d) {
    d *= 1000
    obj[prop] += d * speed;
    if(Math.abs(obj[prop] - value) < Math.abs(d)) {
      obj[prop] = value;
      return true;
    }
  }
}

function moveBlurry(obj, prop, value, speed) {
  const direction = Math.sign(value - obj[prop]);
  const totalDistance = Math.abs(obj[prop] - value);
  const originalValue = obj[prop];
  return function(d) {
    let distanceTravelled = Math.abs(originalValue - obj[prop]);
    let t = distanceTravelled / totalDistance;
    let s = curve.evaluate(t, speed);
    let velocity = Math.abs(obj[prop] - (obj[prop] + d * s * direction));
    motionBlurFilter.velocity = [0, velocity * 2];
    obj[prop] += d * s * direction;
    if(Math.abs(obj[prop] - value) < Math.abs(d * s)) {
      obj[prop] = value;
      motionBlurFilter.velocity = [0,0]
      return true;
    }
  }
}

//// lens blur / focus ////

function unfocusEffect(time, a, b) {
  var elapsedTime = 0;
  return function(d) {
    elapsedTime += d;
    let t = elapsedTime / time;
    blurFilter.blur = common.lerp(t, a, b);
    return t >= 1;
  }
}
      
function unfocus() {
  timeline.start(timeline.once(d => blurFilter.quality = 4), "aesthetics");
  timeline.start(unfocusEffect(0.2, blurFilter.blur, 8), "aesthetics")
  timeline.start(unfocusEffect(0.2, 8, 1), "aesthetics")
  timeline.start(unfocusEffect(0.3, 1, 9), "aesthetics")
  timeline.start(unfocusEffect(0.3, 9, 10), "aesthetics")
  timeline.start(unfocusEffect(0.3, 10, 9), "aesthetics")
  timeline.start(unfocusEffect(0.2, 9, 0), "aesthetics")
  timeline.start(timeline.once(d => {blurFilter.blur = 0; blurFilter.quality = 1;}), "aesthetics");
}

//// glitch  ////

function glitchEffect(s) {
  timeline.start(timeline.once(d => {
    glitchFilter.enabled = true;
    glitchFilter.seed = Math.random() * 10;
    glitchFilter.red = [Math.random() * 10, Math.random() * 10];
    glitchFilter.green = [Math.random() * 10, Math.random() * 10];
    glitchFilter.blue = [Math.random() * 10, Math.random() * 10];
    glitchFilter.refresh()
  }) , "aesthetics");
  timeline.start(d => {
    s -= d;
    if(s <= 0) {
      glitchFilter.enabled = false;
      return true;
    }
  }, "aesthetics");
}

function glitchOut() {
  glitchEffect(0.4);
  glitchEffect(0.2);
}
      
module.exports = {
  sideRuler, bottomRuler, newDust, move, moveBlurry, unfocus, glitchOut,
  filters: { blurFilter, motionBlurFilter, glitchFilter }
}