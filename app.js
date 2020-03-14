require('dotenv').config()
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIO(server);

const PORT = process.env.PORT || 3000;




server.listen(PORT, () => console.log(`started on port: ${PORT}`))