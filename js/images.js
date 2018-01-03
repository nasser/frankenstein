const imageData = require("./js/images.json");
var imageElements = [];

function newImage(s, x, y, scale, rotation) {
  var sprite = new PIXI.Sprite.fromImage('image/' + s + '.jpg');
  sprite.keyword = s;
  sprite.x = x;
  sprite.y = y;
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
  return imageElements.filter(w => {
    for(var i=0; i<touches.length; i++) {
      if(imageContains(w, touches[i].clientX, touches[i].clientY))
        return true;
      return false;
    }
  });
}

function selectedImage(touches) {
  var images = allSelectedImages(touches);
  return images.length == 0 ? null : images[0];
}

function imagePage() {
  var page = new PIXI.Container();
  page.position.x = window.innerHeight;
  for (var k in imageData) {
    let w = imageData[k],
        t = newImage(k, w.x, w.y, w.scale, w.rotation);
    page.addChild(t);
  }
  return page;
}