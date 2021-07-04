const cv = require('opencv4nodejs-prebuilt');
const path = require('path')
const express = require('express')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const fps = 20;
const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100)
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 80)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'))
})

setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64')
    io.emit('image', image)
}, 2500 / fps)

server.listen(3000, () => {
    console.log('Server listening on port 3000')
});