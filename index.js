const express = require('express')
const cors = require('cors')
// const routes = require('./routes/index')
const cv = require('opencv4nodejs-prebuilt');
require('dotenv').config()

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(express.json())

app.use(cors())
// app.use('/', routes);

app.post('/setStreamValue', (req, res) => {
    process.env.streaming = !JSON.parse(process.env.streaming);
    if (!JSON.parse(process.env.streaming)) {
        io.emit('streaming', false)
    } else {
        io.emit('streaming', true)
    }
    console.log(`Valor streaming: ${process.env.streaming}`)
    res.json({
        message: 'success',
        streaming: JSON.parse(process.env.streaming),
    })
})

app.get('/getStreamValue', (req, res) => {

    res.json({
        mensaje: 'exito',
        streaming: JSON.parse(process.env.streaming),
    })
})

/**
 * Stream
 */
const fps = 20;
const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100)
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 80)

setInterval(() => {
    if (JSON.parse(process.env.streaming)) {
        // console.log(process.env.streaming)
        const frame = wCap.read();
        const image = cv.imencode('.jpg', frame).toString('base64')
        io.emit('image', image)
    }
}, 1000 / fps)

server.listen(3000, () => {
    console.log('Server listening on port 3000')
});

module.exports = server;