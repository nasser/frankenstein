document.body.onkeypress = function() {
  // document.body.webkitRequestFullscreen();
  setTimeout(function() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
  }, 100);
}