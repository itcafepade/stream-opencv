const {
    json
} = require('express')
const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'))
})

app.post('/setStreamValue', (req, res) => {
    process.env.streaming = !JSON.parse(process.env.streaming);
    if (process.env.streaming) {
        console.log(`Valor streaming: ${process.env.streaming}`)
    }
    res.json({
        message: 'success',
        streaming: JSON.parse(process.env.streaming),
    })
})

app.get('/getStreamValue', (req, res) => {
    console.log('Hola')
    res.json({
        mensaje: 'exito',
        streaming: JSON.parse(process.env.streaming),
    })
})

module.exports = app;