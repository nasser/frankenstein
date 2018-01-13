const words = require("./words"),
      images = require("./images"),
      network = require("./network"),
      mapping = require("./mapping"),
      common = require("./common"),
      timeline = require("./timeline");

var state = {
  selectedWords: [],
  selectedImages: [],
  /////
  maxImages: 5
};

var uiState = {
  mode: 'words',
  selected: null,
  lastTime: 0,
  touches: [],
  hoverTime: 0,
  /////
  targetHoverTime: 2,
  hoverFromColor: [1, 1, 1],
  hoverToColor: [0.2, 0.1, 1],
};

function hoverColor() {
  const t = common.clamp(uiState.hoverTime / uiState.targetHoverTime, 0, 1),
        r = uiState.hoverToColor[0] * t + uiState.hoverFromColor[0] * (1 - t),
        g = uiState.hoverToColor[1] * t + uiState.hoverFromColor[1] * (1 - t),
        b = uiState.hoverToColor[2] * t + uiState.hoverFromColor[2] * (1 - t);
  return PIXI.utils.rgb2hex([r, g, b]);
}

var logic = {
  images: {
    tick: function(delta) {
      var image = images.selectedImage(uiState.touches);
      
      if(image) {
        uiState.hoverTime += delta / 1000;
        image.tint = hoverColor();
        
      } else {
        images.allImages().forEach(i => i.tint = 0xffffff);
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= uiState.targetHoverTime) {
        state.selectedImages.push(image.keyword);
        if(state.selectedImages.length == state.maxImages) {
          console.log("osc", JSON.stringify(state));
          var mappings = mapping.aggregateMappings(state);
          console.log("mappings", mappings);
          network.sendOSC("/sentiment", mappings.sentiment);
          network.sendOSC("/focus", mappings.focus);
          network.sendOSC("/energy", mappings.energy);
        } else {
          uiState.mode = 'words';
          timeline.start(timeline.move(tray.position, "y", window.innerHeight/2, 2));
        }
        uiState.hoverTime = 0;
      }
    }
  },
  
  words: {
    tick: function(delta) {
      var word = words.selectedWord(uiState.touches);
      
      if(word) {
        uiState.hoverTime += delta / 1000;
        word.style.fill = hoverColor();
        
      } else {
        words.allWords().forEach(w => w.style.fill = 0xffffff);
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= uiState.targetHoverTime) {
        uiState.hoverTime = 0;
        state.selectedWords.push(word.text);
        uiState.mode = 'images';
        timeline.start(timeline.move(tray.position, "y", -window.innerHeight/2, 2));
      }
    }
  }
}

module.exports = { logic, state, uiState }