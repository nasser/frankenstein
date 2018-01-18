const words = require("./words"),
      images = require("./images"),
      aestheticConfig = require("./aesthetic-configuration"),
      networkConfig = require("./network-configuration"),
      interactionConfig = require("./interaction-configuration"),
      network = require("./network"),
      mapping = require("./mapping"),
      common = require("./common"),
      sidebar = require("./sidebar"),
      curve = require("./curve"),
      sound = require("./sound"),
      aesthetics = require("./aesthetics"),
      timeline = require("./timeline");

var state = {
  selectedWords: [],
  selectedImages: []
};

var uiState = {
  mode: 'words',
  selected: null,
  lastTime: 0,
  touches: [],
  hoverTime: 0,
  ignoringTouches: false
};

function start() {
  aesthetics.intro();
  aesthetics.startOccasionals();
}

function stop() {
  aesthetics.outro();
  aesthetics.stopOccasionals();
}


function hoverColor(fromColor, toColor) {
  const t = common.clamp(uiState.hoverTime / interactionConfig.hoverTime, 0, 1),
        r = toColor[0] * t + fromColor[0] * (1 - t),
        g = toColor[1] * t + fromColor[1] * (1 - t),
        b = toColor[2] * t + fromColor[2] * (1 - t);
  return PIXI.utils.rgb2hex([r, g, b]);
}

// #unity/Keyframe [0.0 0.0 0 0.0 100.0] #unity/Keyframe [-650.1121 -650.1121 0 0.3267442 300.0] #unity/Keyframe [0.0 0.0 0 1.0 100.0]

var moveCurve = [curve.keyframe(0, 100, 0, 0), curve.keyframe(0.1, 12000, 0, 0), curve.keyframe(1, 500, 1, 0)]
var moveCurve2 = [curve.keyframe(0, 100, 0, 0), curve.keyframe(0.1, 800, 0, 0), curve.keyframe(1, 500, 1, 0)]

function ignoreTouches() {
  return uiState.ignoringTouches || (interactionConfig.waitForFourTouches && uiState.touches.length != 4);
}

var logic = {
  images: {
    tick: function(delta) {
      images.allImages().forEach(i => i.tint = 0x0);
      
      if(ignoreTouches()) return;
      var image = images.selectedImage(uiState.touches);
      
      if(image != uiState.selected)
        uiState.hoverTime = 0;
      uiState.selected = image;
      
      if(image) {
        uiState.hoverTime += delta;
        image.tint = hoverColor([0, 0, 0], aestheticConfig.highlightColor);
        
      } else {
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= interactionConfig.hoverTime) {
        state.selectedImages.push(image.keyword);
        if(state.selectedImages.length == interactionConfig.totalSelections) {
          const idx = state.selectedImages.length - 1;
          sidebar.display(idx, state.selectedWords[idx], image);
          sidebar.hideAll();
          
          console.log("osc", JSON.stringify(state));
          var package = mapping.aggregateMappings(state);
          package.unit = networkConfig.unit;
          package.words = state.selectedWords;
          package.parts = state.selectedImages;
          console.log("package", package);
          network.sendOSC("/surface-sentiments", JSON.stringify(package));
          timeline.start(aesthetics.moveBlurry(tray.position, "y", -window.innerHeight * 9 + window.innerHeight/2, moveCurve2));
          
        } else {
          const idx = state.selectedImages.length - 1;
          sidebar.display(idx, state.selectedWords[idx], image);
          
          uiState.mode = 'words';
          uiState.ignoringTouches = true;
          setTimeout(() => uiState.ignoringTouches = false,
            interactionConfig.ignoreTouchesTimeout * 1000);
          sound.bank.slideStartReverse().play();
          sound.bank.slideLoopReverse().play({loop:true});
          timeline.start(aesthetics.moveBlurry(tray.position, "y", window.innerHeight/2, moveCurve));
          timeline.start(timeline.once(d => {
            sound.bank.slideStopReverse().play();
            sound.bank.slideLoopReverse().stop();
            // aesthetics.shuffleFillerPages();
          }));
        }
        uiState.hoverTime = 0;
      }
    }
  },
  
  words: {
    tick: function(delta) {
      words.allWords().forEach(w => w.style.fill = 0x0);
      
      if(ignoreTouches()) return;
      var word = words.selectedWord(uiState.touches);
      
      if(word) {
        uiState.hoverTime += delta;
        word.style.fill = hoverColor([0, 0, 0], aestheticConfig.highlightColor);
        
      } else {
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= interactionConfig.hoverTime) {
        uiState.hoverTime = 0;
        state.selectedWords.push(word.text);
        uiState.mode = 'images';
        uiState.ignoringTouches = true;
        setTimeout(() => uiState.ignoringTouches = false,
          interactionConfig.ignoreTouchesTimeout * 1000);
        sound.bank.slideStart().play();
        sound.bank.slideLoop().play({loop:true});
        timeline.start(aesthetics.moveBlurry(tray.position, "y", -window.innerHeight * 8 + window.innerHeight/2, moveCurve));
        timeline.start(timeline.once(d => {
          sound.bank.slideStop().play();
          sound.bank.slideLoop().stop();
          // aesthetics.shuffleFillerPages();
        }))
      }
    }
  }
}

module.exports = { stop, start, logic, state, uiState, moveCurve }