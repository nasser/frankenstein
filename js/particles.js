const PIXI = require("pixi.js"),
      config = require("./aesthetic-configuration"),
      touch = require("./touch.js");

require("pixi-particles");

var emitters = [];

function sparks(container) {
    var e = new PIXI.particles.Emitter(
        container,
        [PIXI.Texture.fromImage('image/spark.png')],
        {
            "alpha": {
                "start": 1,
                "end": 0
            },
            "scale": {
                "start": 1,
                "end": 0.2,
                "minimumScaleMultiplier": 1
            },
            "color": {
                "start": "#eded7c",
                "end": "#f06e7d"
            },
            "speed": {
                "start": 1000,
                "end": 16,
                "minimumSpeedMultiplier": 1
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 90-15,
                "max": 90+15
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 90
            },
            "lifetime": {
                "min": 0.1,
                "max": 1
            },
            "blendMode": "normal",
            "frequency": 0.001,
            "emitterLifetime": -1,
            "maxParticles": 200,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": false,
            "spawnType": "circle",
            "spawnCircle": {
                "x": 0,
                "y": 0,
                "r": 10
            }
        });
    e.emit = false;
    emitters.push(e);
    return e;
}

function initSparks(container) {
    sparks(container);
    sparks(container);
    sparks(container);
    sparks(container);
    console.log("initialized particle systems")
}

function updateNumberOfTouches(n) {
    n -= 1;
    for (var i = 0; i < emitters.length; i++) {
        emitters[i].emit = i <= n;
    }
}

function updatePositions(touches) {
    // if(touches.length != emitters.length) return;
    for (var i = 0; i < touches.length; i++) {
        emitters[i].ownerPos.x = touches[i].clientX;
        emitters[i].ownerPos.y = touches[i].clientY;
    }
}

function updateAesthetics(touches) {
    let p = touch.centroid(touches);
    for (var i = touches.length - 1; i >= 0; i--) {
        let angle = Math.atan2(touches[i].clientY - p.y, touches[i].clientX - p.x);
        emitters[i].rotate(angle * (180 / Math.PI));
        emitters[i].maxLifetime = config.particleLifetimes[touches.length];
        emitters[i].startColor = config.particleStartColors[touches.length];
        emitters[i].endColor = config.particleEndColors[touches.length];
        emitters[i].frequency = config.particleFrequencies[touches.length];
        emitters[i].minStartRotation = config.particleMinStartRotation[touches.length];
        emitters[i].maxStartRotation = config.particleMaxStartRotation[touches.length];
    }
}

function focusSparks(touches) {
    // if(touches.length != emitters.length) return;
    n -= 1;
    for (var i = 0; i < emitters.length; i++) {
        emitters[i].emit = i <= n;
    }
}

function updateEmitters(d, touches) {
    for (var i = emitters.length - 1; i >= 0; i--) {
        emitters[i].update(d);
    }
    updateNumberOfTouches(touches.length);
    updatePositions(touches);
    updateAesthetics(touches);
}

module.exports = { updateNumberOfTouches, initSparks, sparks, updateEmitters, emitters }