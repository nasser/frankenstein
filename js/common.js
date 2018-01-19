function contains(array, value) {
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i] == value)
      return true;
  }
  return false;
}

function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x;
}

function lerp(t, a, b) {
  return (1 - t) * a + t * b;
}

function inverseLerp(t, a, b) {
  return ( t - a ) / ( b - a );
}

module.exports = { contains, clamp, lerp, inverseLerp }