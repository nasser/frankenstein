const parseCSV = require('csv-parse'),
      fs = require("fs"),
      csvSource = fs.readFileSync("js/mapping.csv");
var csvData;

parseCSV(csvSource, {comment: '#', trim:true}, function(err, output) {
  if(err) throw err;
  csvData = output;
  console.log("parsed mapping csv") 
});

function getMapping(inWord, inImage) {
  for(var i=0; i<csvData.length; i++) {
    var [word, image, sentiment, focus, energy] = csvData[i];
    sentiment = parseFloat(sentiment);
    focus = parseFloat(focus);
    energy = parseFloat(energy);
    if(word === inWord && image === inImage)
      return {sentiment, focus, energy};
  }
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