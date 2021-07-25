const express = require('express')
const cv = require('opencv4nodejs-prebuilt');
const io = require('../index')
console.log(io)

const fps = 5;
const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100)
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 80)

setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64')
    io.emit('image', image)
}, 2500 / fps)