var osc = require('node-osc'),
    state = require("./state")
    config = require("./network-configuration")
var oscClient;

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

var oscServer = new osc.Server(config.port, '0.0.0.0');

oscServer.on("/start-surface", function (msg, rinfo) {
  console.log("got start message");
  state.start();
});

oscServer.on("/reset-surface", function (msg, rinfo) {
  console.log("got reset message");
  location.reload();
});

module.exports = { sendOSC, connectOSC }