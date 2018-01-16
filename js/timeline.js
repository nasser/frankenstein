var timelines = { default: [] };

function start(f, tl) {
  if(tl === undefined)
    tl = "default"
  timelines[tl] = timelines[tl] || [];
  timelines[tl].push(f);
}

function once(f) {
  return function(d) {
    f(d);
    return true;
  }
}

function runTimeline(t, d) {
  if(t.length == 0)
    return;
  var r = t[0](d);
  if(r === true) t.shift();
}

function runTimelines(d) {
  var tls = Object.keys(timelines);
  for (var i = tls.length - 1; i >= 0; i--) {
    runTimeline(timelines[tls[i]], d);
  }
}

module.exports = { runTimelines, start, once, timelines }