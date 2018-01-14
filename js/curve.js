const common = require("./common");

function keyframe(x, y, _in, out) {
  return { x, y, _in, out }
}

// https://answers.unity.com/questions/508140/animation-curve-equation-.html
function _evaluate(t, k0, k1) {
  let dt = k1.x - k0.x;
 
  let m0 = k0.out * dt;
  let m1 = k1._in * dt;
 
  let t2 = t * t;
  let t3 = t2 * t;
 
  let a = 2 * t3 - 3 * t2 + 1;
  let b = t3 - 2 * t2 + t;
  let c = t3 - t2;
  let d = -2 * t3 + 3 * t2;
 
  return a * k0.y + b * m0 + c * m1 + d * k1.y;
}

function evaluate(t, ks) {
  for (var i = 0; i < ks.length-1; i++) {
    // console.log(t, ks[i].x, ks[i+1].x, ks[i].x <= t && ks[i+1].x > t)
    if(ks[i].x <= t && ks[i+1].x > t)
      return _evaluate(common.inverseLerp(t, ks[i].x, ks[i+1].x), ks[i], ks[i+1]);
  }
  
  throw t + " out of curve range"
}

module.exports = { keyframe, evaluate }