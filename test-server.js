var osc = require('node-osc');

var oscServer = new osc.Server(3333, '0.0.0.0');

oscServer.on("/sentiment", function (msg, rinfo) {
  console.log("## sentiment message ##");
  console.log(msg);
});

oscServer.on("/focus", function (msg, rinfo) {
  console.log("## focus message ##");
  console.log(msg);
});

oscServer.on("/energy", function (msg, rinfo) {
  console.log("## energy message ##");
  console.log(msg);
});