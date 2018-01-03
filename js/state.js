var state = {
  selectedWords: [],
  selectedImages: [],
  /////
  maxImages: 2
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
  const t = clamp(uiState.hoverTime / uiState.targetHoverTime, 0, 1),
        r = uiState.hoverToColor[0] * t + uiState.hoverFromColor[0] * (1 - t),
        g = uiState.hoverToColor[1] * t + uiState.hoverFromColor[1] * (1 - t),
        b = uiState.hoverToColor[2] * t + uiState.hoverFromColor[2] * (1 - t);
  return PIXI.utils.rgb2hex([r, g, b]);
}

function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x;
}


var logic = {
  images: {
    tick: function(delta) {
      var image = selectedImage(uiState.touches);
      
      if(image) {
        uiState.hoverTime += delta / 1000;
        image.tint = hoverColor();
        
      } else {
        allImages().forEach(i => i.tint = 0xffffff);
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= uiState.targetHoverTime) {
        state.selectedImages.push(image.keyword);
        if(state.selectedImages.length == state.maxImages) {
          console.log("osc", JSON.stringify(state));
          sendOSC("/sentiment", state.selectedImages.length)
          sendOSC("/focus", 0.4)
          sendOSC("/energy", uiState.hoverTime)
        } else {
          uiState.mode = 'words';
          start(move(tray.position, "y", window.innerHeight/2, 2));
        }
        uiState.hoverTime = 0;
      }
    }
  },
  
  words: {
    tick: function(delta) {
      var word = selectedWord(uiState.touches);
      
      if(word) {
        uiState.hoverTime += delta / 1000;
        word.style.fill = hoverColor();
        
      } else {
        allWords().forEach(w => w.style.fill = 0xffffff);
        uiState.hoverTime = 0;
        
      }
      
      if(uiState.hoverTime >= uiState.targetHoverTime) {
        uiState.hoverTime = 0;
        state.selectedWords.push(word.text);
        uiState.mode = 'images';
        start(move(tray.position, "y", -window.innerHeight/2, 2));
      }
    }
  }
}