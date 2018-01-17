const osc = require('node-osc'),
      state = require("./state"),
      config = require("./network-configuration");

var oscClient, oscServer;

function connectOSC(ip, port) {
  oscClient = new osc.Client(ip, port);
  console.log("osc connected", ip, port);
}

function sendOSC(address, param) {
  oscClient.send(address, param, function () {
    console.log("osc sent", address, param);
  });
}

connectOSC(config.remoteIP, config.port);
oscServer = new osc.Server(config.port, '0.0.0.0');

module.exports = { sendOSC, connectOSC, client:oscClient, server:oscServer }