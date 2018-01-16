const imageData = require("./images.json"),
      touch = require("./touch.js");
      
var imageElements = [];

function newImage(s, x, y, scale, rotation) {
  var sprite = new PIXI.Sprite.fromImage('image/parts/' + s + '.png');
  sprite.keyword = s;
  sprite.x = x * (window.innerWidth/4);
  sprite.y = y * (window.innerHeight/4);
  sprite.texture.baseTexture.on('loaded', function(){
    sprite.scale.x = scale;
    sprite.scale.y = scale;
    sprite.pivot.x = sprite.width / 2 / scale;
    sprite.pivot.y = sprite.height / 2 / scale;
    sprite.rotation = rotation;
  });
  imageElements.push(sprite);
  return sprite;
}

function imageContains(image, x, y) {
  var points = [{x:0,y:0},
                {x:image.width/image.scale.x,y:0},
                {x:image.width/image.scale.x,y:image.height/image.scale.y},
                {x:0,y:image.height/image.scale.y}].
                map(x => image.worldTransform.apply(x));
  return new PIXI.Polygon(points).contains(x, y);
}

function allImages() {
  return imageElements;
}

function allSelectedImages(touches) {
  var p = touch.centroid(touches);
  return imageElements.filter(w => imageContains(w, p.x, p.y));
}

function selectedImage(touches) {
  var images = allSelectedImages(touches);
  return images.length == 0 ? null : images[0];
}

function imagePage(n) {
  var page = new PIXI.Container();
  page.position.x = window.innerHeight * n;
  for (var k in imageData) {
    let w = imageData[k],
        t = newImage(k, w.x, w.y, w.scale, w.rotation);
    page.addChild(t);
  }
  return page;
}

module.exports = { imagePage, selectedImage, allSelectedImages, allImages, imageContains, newImage }