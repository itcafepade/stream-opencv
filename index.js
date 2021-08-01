const express = require('express')
const cors = require('cors')
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

app.post('/setStreamValue', (req, res) => {

    if (req.body.camara == 'camara0') {
        process.env.streamingCam0 = !JSON.parse(process.env.streamingCam0);

        if (JSON.parse(process.env.streamingCam0)) {
            io.emit('streamingCam0', false)
        } else {
            io.emit('streamingCam0', true)
        }

        console.log(`Valor streaming Cam 0: ${process.env.streamingCam0}`)

        res.json({
            message: 'success',
            streaming: JSON.parse(process.env.streamingCam0),
        })
    }


    if (req.body.camara == 'camara1') {
        process.env.streamingCam1 = !JSON.parse(process.env.streamingCam1);

        if (JSON.parse(process.env.streamingCam1)) {
            io.emit('streamingCam1', false)
        } else {
            io.emit('streamingCam1', true)
        }

        console.log(`Valor streaming Cam 1: ${process.env.streamingCam1}`)

        res.json({
            message: 'success',
            streaming: JSON.parse(process.env.streamingCam1),
        })
    }
})

app.get('/getStreamValue', (req, res) => {

    res.json({
        mensaje: 'exito',
        streamingCam0: JSON.parse(process.env.streamingCam0),
        streamingCam1: JSON.parse(process.env.streamingCam1),
    })
})

/**
 * Stream
 */
const fps = 20;
const wCap = new cv.VideoCapture(0); //Webcam 1
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 40)
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 20)

setInterval(() => {
    if (JSON.parse(process.env.streamingCam0)) {
        // console.log(process.env.streaming)
        const frame = wCap.read();
        const image = cv.imencode('.jpeg', frame).toString('base64')
        io.emit('image-wCap', image)
    }
}, 1000 / fps)

const wCap1 = new cv.VideoCapture(1); //Webcam 2
wCap1.set(cv.CAP_PROP_FRAME_WIDTH, 100)
wCap1.set(cv.CAP_PROP_FRAME_HEIGHT, 80)


setInterval(() => {
    if (JSON.parse(process.env.streamingCam1)) {
        const frame = wCap1.read();
        const image = cv.imencode('.jpeg', frame).toString('base64')
        io.emit('image-wCap1', image)
    }
}, 1000 / fps)

server.listen(3000, () => {
    console.log('Server listening on port 3000')
});

module.exports = server;