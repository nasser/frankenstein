require("pixi.js");

var images = [];
var texts = [];

function finaleSprite(x, y) {
  var sprite = new PIXI.Sprite();
  sprite.position.x = x
  sprite.position.y = y
  sprite.tint = 0;
  sprite.scale.x = 0.8;
  sprite.scale.y = 0.8;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1.05;
  return sprite;
}

function finaleText(x, y) {
  var text = new PIXI.Text("");
  text.position.x = x;
  text.position.y = y;
  text.style.fill = "black";
  text.style.fontFamily = "Memphis";
  text.style.fontSize = 40;
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  return text;
}

function finalePage(n) {
  var page = new PIXI.Container();
  page.position.x = window.innerHeight * n;
  var s;
  var t;
  s = finaleSprite(-300, 700);
  page.addChild(s)
  images.push(s);
  
  t = finaleText(-300, 700);
  page.addChild(t)
  texts.push(t);
  
  s = finaleSprite(300, 700);
  page.addChild(s)
  images.push(s);
  
  t = finaleText(300, 700);
  page.addChild(t)
  texts.push(t);
  
  s = finaleSprite(-300, -200);
  page.addChild(s)
  images.push(s);
  
  t = finaleText(-300, -200);
  page.addChild(t)
  texts.push(t);
  
  s = finaleSprite(300, -200);
  page.addChild(s)
  images.push(s);
  
  t = finaleText(300, -200);
  page.addChild(t)
  texts.push(t);
  
  s = finaleSprite(0, 300);
  page.addChild(s)
  images.push(s);
  
  t = finaleText(0, 300);
  page.addChild(t)
  texts.push(t);
  
  return page;
}

function update(i, text, image) {
  images[i].texture = image.texture;
  texts[i].text = text;
}


module.exports = { finalePage, update }