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

// connectOSC("127.0.0.1", 7007);

// sendOSC("/start-surface", 1);

var oscServer = new osc.Server(7007, '0.0.0.0');

oscServer.on("/surface-sentiments", function (msg, rinfo) {
  console.log("## surface-sentiments message ##");
  console.log(msg);
});