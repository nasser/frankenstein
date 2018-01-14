function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x;
}

function lerp(t, a, b) {
  return (1 - t) * a + t * b;
}

function inverseLerp(t, a, b) {
  return ( t - a ) / ( b - a );
}

module.exports = { clamp, lerp, inverseLerp }