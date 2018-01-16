const wordData = require("./words.json"),
      aestheticConfig = require("./aesthetic-configuration"),
      touch = require("./touch");

var wordElements = [];

function newText(s, x, y, rotation, scale) {
  var text = new PIXI.Text(s);
  text.x = x * (window.innerHeight*0.6);
  text.y = y * (window.innerWidth*0.6);
  text.style.fill = "#ccaabb";
  text.style.fontFamily = "Memphis";
  text.style.fontSize = scale;
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
  var p = touch.centroid(touches);
  return wordElements.filter(w => textContains(w, p.x, p.y));
}

function selectedWord(touches) {
  var words = allSelectedWords(touches);
  return words.length == 0 ? null : words[0];
}

function wordPage(n) {
  var page = new PIXI.Container();
  page.position.x = window.innerHeight * n;
  for (var k in wordData) {
    let w = wordData[k],
        t = newText(k, w.x, w.y, w.rotation, w.scale);
    t.rotation += Math.random() * aestheticConfig.wordRotationJitter - (aestheticConfig.wordRotationJitter/2);
    page.addChild(t);
  }
  return page;
}

module.exports = { wordPage, selectedWord, allSelectedWords, allWords, textContains, newText }