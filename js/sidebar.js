const PIXI = require("pixi.js"),
      aesthetics = require("./aesthetics"),
      timeline = require("./timeline"),
      finale = require("./finale"),
      config = require("./aesthetic-configuration");

const containers = [];
const images = [];
const texts  = [];

function newSideElement(y) {
  var container = new PIXI.Container();
  container.x = window.innerWidth + 200;
  container.y = y;
  container.rotation = Math.PI/2;
  
  var sprite = new PIXI.Sprite();
  sprite.tint = 0xffffff;
  sprite.scale.x = 0.2;
  sprite.scale.y = 0.2;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = -0.2;
  container.addChild(sprite)
  images.push(sprite);
  
  var text = new PIXI.Text("");
  text.style.fill = "white";
  text.style.fontFamily = "Memphis";
  text.style.fontSize = 20;
  text.anchor.x = 0.5
  text.anchor.y = 0.5
  container.addChild(text)
  texts.push(text);
  
  containers.push(container);
  return container;
}

function display(i, text, image) {
  finale.update(i, text, image);
  timeline.start(aesthetics.move(containers[i], "x", window.innerWidth - 40, 500), 'sidebar');
  images[i].texture = image.texture;
  texts[i].text = text;
}

function hideAll() {
  console.log("hideAll")
  delete timeline.timelines.sidebar;
  for (var i = containers.length - 1; i >= 0; i--) {
    containers[i].destroy();
    // timeline.start(aesthetics.move(containers[i], "x", window.innerWidth + 200, 520), 'sidebar');
  }
}

function init(container) {
  container.addChild(newSideElement(150));
  container.addChild(newSideElement(350));
  container.addChild(newSideElement(550));
  container.addChild(newSideElement(750));
  container.addChild(newSideElement(950));
}

module.exports = { newSideElement, display, init, hideAll }