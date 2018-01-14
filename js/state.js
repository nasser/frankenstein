const words = require("./words"),
      images = require("./images"),
      network = require("./network"),
      mapping = require("./mapping"),
      common = require("./common"),
      curve = require("./curve"),
      aesthetics = require("./aesthetics"),
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
  targetHoverTime: 2
};

function hoverColor(fromColor, toColor) {
  const t = common.clamp(uiState.hoverTime / uiState.targetHoverTime, 0, 1),
        r = toColor[0] * t + fromColor[0] * (1 - t),
        g = toColor[1] * t + fromColor[1] * (1 - t),
        b = toColor[2] * t + fromColor[2] * (1 - t);
  return PIXI.utils.rgb2hex([r, g, b]);
}

// #unity/Keyframe [0.0 0.0 0 0.0 100.0] #unity/Keyframe [-650.1121 -650.1121 0 0.3267442 300.0] #unity/Keyframe [0.0 0.0 0 1.0 100.0]

var moveCurve = [curve.keyframe(0, 100, 0, 0), curve.keyframe(0.1, 6000, 0, 0), curve.keyframe(1, 100, 1, 0)]

var logic = {
  images: {
    tick: function(delta) {
      var image = images.selectedImage(uiState.touches);
      
      if(image) {
        uiState.hoverTime += delta;
        image.tint = hoverColor([1, 1, 1], [0.2, 0.1, 1]);
        
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
          timeline.start(aesthetics.moveBlurry(tray.position, "y", window.innerHeight/2, moveCurve));
        }
        uiState.hoverTime = 0;
      }
    }
  },
  
  words: {
    tick: function(delta) {
      var word = words.selectedWord(uiState.touches);
      
      if(word) {
        uiState.hoverTime += delta;
        word.style.fill = hoverColor([0, 0, 0], [0.2, 0.1, 1]);
        
      } else {
        words.allWords().forEach(w => w.style.fill = 0x0);
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= uiState.targetHoverTime) {
        uiState.hoverTime = 0;
        state.selectedWords.push(word.text);
        uiState.mode = 'images';
        timeline.start(aesthetics.moveBlurry(tray.position, "y", -window.innerHeight/2, moveCurve));
      }
    }
  }
}

module.exports = { logic, state, uiState, moveCurve }