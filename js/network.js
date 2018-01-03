var osc = require('node-osc');
var client = new osc.Client('127.0.0.1', 3333);

function sendOSC(address, param) {
  client.send(address, param, function () {
    console.log("sent", address, param);
  });
}
