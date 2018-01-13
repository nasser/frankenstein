var osc = require('node-osc');
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

module.exports = { sendOSC, connectOSC }