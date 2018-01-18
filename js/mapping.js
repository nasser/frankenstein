const fs = require("fs"),
      emotions = require("./emotions"),
      parts = require("./parts")
      common = require("./common");

function getMapping(inWord, inImage) {
  var attribute = parts[inImage];
  var value = emotions[inWord][parts[inImage]] * 1.25;
  var mapping = {sentiment:0, focus:0, energy:0}
  mapping[attribute] = common.clamp(value, -1, 1);
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
  finalMapping.sentiment = common.clamp(finalMapping.sentiment, -1, 1);
  finalMapping.focus = common.clamp(finalMapping.focus, -1, 1);
  finalMapping.energy = common.clamp(finalMapping.energy, -1, 1);
  return finalMapping;
}

module.exports = { aggregateMappings, getMapping }