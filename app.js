require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')

const app = express()

app.use(
    cors({
      credentials: true,
      origin: [process.env.FRONTENDPOINT]
    })
)

const server = http.Server(app)
const io = socketIO(server);

const PORT = process.env.PORT || 3000;



const users = []
const socketByUser = []

io.on('connection', (socket) => {
    socket.on('add_user', user => {
        console.log('user add...')
        users.push( user )
        socketByUser.push({id: socket.id, user})
        io.emit('users', users)
    })

    socket.on('message', msg => {
        io.emit('message', msg)
    })

    socket.on('disconnect', ()=>{
        const [found] = socketByUser.filter( item => item.id === socket.id )
        if( found ){
            const idx = users.indexOf(found.user)
            if(idx > -1 ) users.splice( idx, 1)
        }
        io.emit('users', users)
    })
})

app.use('/getTotalUsers', (_, res) => res.status(200).json({total: users.length}))

server.listen(PORT, () => console.log(`started on port: ${PORT}`))