const PIXI = require("pixi.js"),
      pixiFilters = require("pixi-filters"),
      common = require("./common"),
      config = require("./aesthetic-configuration"),
      curve = require("./curve"),
      sound = require("./sound"),
      timeline = require("./timeline"),
      blurFilter = new PIXI.filters.BlurFilter(),
      glitchFilter = new pixiFilters.GlitchFilter(),
      motionBlurFilter = new pixiFilters.MotionBlurFilter();
      
blurFilter.blur = 0;
blurFilter.quality = 1;
motionBlurFilter.kernelSize = 11;
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

function corner(t, x, y, r) {
  var sprite = new PIXI.Sprite.fromImage('image/microfilm/corner-' + t +'.png');
  sprite.texture.baseTexture.on('loaded', function(){
    sprite.pivot.x = sprite.width / 2;
    sprite.pivot.y = 0;
    sprite.x = x;
    sprite.y = y;
    sprite.rotation = Math.PI/2 * r;
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

function wait(s) {
  return d => (s -= d) <= 0;
}

function move(obj, prop, value, speed) {
  var direction = Math.sign(value - obj[prop]);
  speed *= direction;
  return function(d) {
    // d *= 1000
    if(!obj && !obj[prop])
      return true;
    obj[prop] += d * speed;
    if(Math.abs(obj[prop] - value) < Math.abs(d * speed)) {
      obj[prop] = value;
      return true;
    }
  }
}

function moveRelative(obj, prop, value, speed) {
  return move(obj, prop, obj[prop] + value, speed);
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
  var sfx = sound.bank.focus();
  sfx.play();
  var divisions = Math.floor(Math.random() * 2) + 3; 
  
  timeline.start(timeline.once(d => blurFilter.quality = 4), "aesthetics");
  var lastBlur = blurFilter.blur;
  for(var i=0; i<divisions-1; i++) {
    var nextBlur = Math.random() * 11;
    timeline.start(unfocusEffect(sfx.duration/divisions, lastBlur, nextBlur), "aesthetics")
    lastBlur = nextBlur;
  }
  timeline.start(unfocusEffect(sfx.duration/divisions, lastBlur, 0), "aesthetics")
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
  var sfx = sound.bank.glitch();
  sfx.play();
  var divisions = Math.floor(Math.random() * 2) + 1; 
  for(var i=0; i<divisions; i++)
    glitchEffect(sfx.duration/divisions);
}

//// adjust rotation ////

function adjustRotation(tray) {
  var originalRotation = tray.rotation;
  timeline.start(move(tray, "rotation", originalRotation+0.5, 1))
  // timeline.start(wait(0.1))
  timeline.start(move(tray, "rotation", originalRotation, 2))
}
      
//// filler pages ////

const fillerPageCount = 2;
var fillerSprites = [];

function fillerPage(n) {
  var i = Math.floor(Math.random() * fillerPageCount);
  var path = 'image/pages/page' + i + '.png';
  var page = new PIXI.Sprite.fromImage(path);
  page.position.x = window.innerHeight * n;
  page.texture.baseTexture.on('loaded', function(){
    let scale =  window.innerWidth / page.height;
    page.scale.x = scale;
    page.scale.y = scale;
    page.pivot.x = page.width / 2 / scale;
    page.pivot.y = page.height / 2 / scale;
    page.rotation = Math.PI/2;
  });
  
  fillerSprites.push(page);
  
  return page;
}

function shuffleFillerPages() {
  var tray = fillerSprites[0].parent;
  for (var i = fillerSprites.length - 1; i >= 0; i--) {
    fillerSprites[i].destroy();
  }
  
  fillerSprites = [];
  
  tray.addChild(aesthetics.fillerPage(2));
  tray.addChild(aesthetics.fillerPage(3));
  tray.addChild(aesthetics.fillerPage(4));
  tray.addChild(aesthetics.fillerPage(5));
  tray.addChild(aesthetics.fillerPage(6));
}

//// bulb ////

var _bulb;

function bulb() {
  var bulb = new PIXI.Sprite.fromImage('image/bulb.jpg');
  bulb.width = window.innerWidth;
  bulb.height = window.innerHeight;
  bulb.tint = PIXI.utils.rgb2hex([0,0,0])
  _bulb = bulb;
  return bulb;
}

function blackColor(v) {
  return PIXI.utils.rgb2hex([v, v, v]);
}

function slowFlicker() {
  sound.bank.slowFlicker().play();
  var speed = 0.5;
  var v = 1;
  timeline.start(d => {
    v -= d * speed;
    _bulb.tint = blackColor(v);
    return v <= 0.1;
  }, 'aesthetics');
  timeline.start(d => {
    v += d * speed * 6;
    _bulb.tint = blackColor(v);
    return v >= 0.9;
  }, 'aesthetics');
}

function quickFlicker() {
  sound.bank.quickFlicker().play();
  var speed = 5;
  var v = 1;
  for(var i=0; i<2; i++) {
    timeline.start(d => {
      v -= d * speed;
      _bulb.tint = blackColor(v);
      return v <= 0.1;
    }, 'aesthetics');
    timeline.start(d => {
      v += d * speed;
      _bulb.tint = blackColor(v);
      return v >= 0.9;
    }, 'aesthetics');
  }
}

//// intro/outro ////

function intro() {
  sound.bank.powerOn().play();
  sound.bank.background().play({loop:true});
  
  var speed = 0.1;
  var v = 0;
  timeline.start(d => {
    v += d * speed;
    _bulb.tint = blackColor(v);
    if(v >= 0.9) {
      _bulb.tint = blackColor(0.95);
      return true;
    }
  });
  
  for (var i = 0; i < 4; i++) {
    occasional([unfocus, glitchOut]);
    timeline.start(wait(Math.random() * 5), 'aesthetics')
  }
  
}

function outro() {
  // sound.bank.powerOff().play();
  sound.bank.background().stop(); // fade out?
  
  var speed = 0.1;
  var v = 0.95;
  
  timeline.start(d => {
    v -= d * speed;
    _bulb.tint = blackColor(v);
    if(v <= d * speed) {
      _bulb.tint = blackColor(0);
      return true;
    }
  });

}


//// greebles ////

function newGreeble(x, y, rotation) {
  var s = Math.floor(Math.random() * 6);
  var sprite = new PIXI.Sprite.fromImage('image/microfilm/greeble' + s + '.png');
  sprite.x = x;
  sprite.y = y;
  sprite.texture.baseTexture.on('loaded', function(){
    sprite.pivot.x = sprite.width / 2;
    sprite.pivot.y = sprite.height / 2;
    sprite.rotation = rotation;
  });
  return sprite;
}

//// occasionals ////

var occasionalsHandle;

function occasional(effects) {
  effects = effects || [unfocus, glitchOut, quickFlicker];
  var randomEffect = effects[Math.floor(Math.random() * effects.length)]
  randomEffect();
}

function startOccasionals() {
  occasionalsHandle = setInterval(function() {
    if(Math.random() < config.occasionalChance)
      occasional();
  }, config.occasionalFrequency * 1000);
}

function stopOccasionals() {
  clearInterval(occasionalsHandle);
}

module.exports = {
  fillerSprites,
  outro, stopOccasionals, intro, newGreeble, bulb, quickFlicker, slowFlicker, startOccasionals, corner, fillerPage,
  shuffleFillerPages, adjustRotation, sideRuler, bottomRuler, newDust,
  move, moveRelative, moveBlurry, unfocus, glitchOut,
  filters: { blurFilter, motionBlurFilter, glitchFilter }
}