const config = require("./audio-configuration");
require("pixi.js");
require("pixi-sound");

var bank = {};

function init(cb) {
  for (let name in config) {
    if(typeof config[name] === "string") {
      if(!PIXI.loader.resources[config[name]]) {
        PIXI.loader.add(config[name], "sound/" + config[name])
      }
    } else {
      for(var i=0; i<config[name].length; i++) {
        if(!PIXI.loader.resources[config[name][i]]) {
          PIXI.loader.add(config[name][i], "sound/" + config[name][i])
        }
      }
    }
  }
  
  PIXI.loader.load(function(loader, resources) {
    for (let name in config) {
      if(typeof config[name] === "string") {
        bank[name] = function() { return resources[config[name]].sound }
      } else {
        bank[name] = function() {
          if(config[name])
          var e = config[name][Math.floor(Math.random()*config[name].length)];
          return resources[e].sound;
        }
      }
    }
    
    if(cb) cb();
    console.log("loaded " + Object.keys(resources).length + " sounds")
  });
}

function play(id) {
  
}

module.exports = { play, init, bank }