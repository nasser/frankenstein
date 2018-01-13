var timeline = [];

function start(f) {
  timeline.push(f);
}

function move(obj, prop, value, speed) {
  var direction = Math.sign(value - obj[prop]);
  speed *= direction;
  return function(d) {
    obj[prop] += d * speed;
    if(Math.abs(obj[prop] - value) < Math.abs(d)) {
      obj[prop] = value;
      return true;
    }
  }
}

function runTimeline(d) {
  if(timeline.length == 0)
    return;
  var r = timeline[0](d);
  if(r === true) timeline.shift();
}

module.exports = { runTimeline, move, start }