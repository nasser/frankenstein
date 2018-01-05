const fs = require("fs"),
      emotions = require("./js/emotions"),
      parts = require("./js/parts");

function getMapping(inWord, inImage) {
  var attribute = parts[inImage];
  var value = emotions[inWord][parts[inImage]] * 1.25;
  var mapping = {sentiment:0, focus:0, energy:0}
  mapping[attribute] = clamp(value, -1, 1);
  return mapping;
}

function aggregateMappings(wordsAndImages) {
  var {selectedWords, selectedImages} = wordsAndImages;
  var finalMapping = {sentiment:0, focus:0, energy:0};
  for(var i=0; i<selectedWords.length; i++) {
    let mapping = getMapping(selectedWords[i], selectedImages[i]);
    finalMapping.sentiment += mapping.sentiment;
    finalMapping.focus += mapping.focus;
    finalMapping.energy += mapping.energy;
  }
  return finalMapping;
}