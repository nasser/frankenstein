const wordData = require("./js/words.json");
var wordElements = [];

function newText(s, x, y, rotation) {
  var text = new PIXI.Text(s);
  text.x = x;
  text.y = y;
  text.style.fill = "black";
  var metrics = PIXI.TextMetrics.measureText(text.text, text.style)
  text.pivot.x = metrics.width/2;
  text.pivot.y = metrics.height/2;
  text.rotation = rotation;
  wordElements.push(text);
  return text;
}

function textContains(text, x, y) {
  var metrics = PIXI.TextMetrics.measureText(text.text, text.style)
  var points = [{x:0,y:0},
                {x:metrics.width,y:0},
                {x:metrics.width,y:metrics.height},
                {x:0,y:metrics.height}].
                map(x => text.worldTransform.apply(x));
  return new PIXI.Polygon(points).contains(x, y);
}

function allWords() {
  return wordElements;
}

function allSelectedWords(touches) {
  return wordElements.filter(w => {
    for(var i=0; i<touches.length; i++) {
      if(textContains(w, touches[i].clientX, touches[i].clientY))
        return true;
      return false;
    }
  });
}

function selectedWord(touches) {
  var words = allSelectedWords(touches);
  return words.length == 0 ? null : words[0];
}

function wordPage() {
  var page = new PIXI.Container();
  for (var k in wordData) {
    let w = wordData[k],
        t = newText(k, w.x, w.y, w.rotation);
    page.addChild(t);
  }
  return page;
}