require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketIO(server);

app.use(
    cors({
      credentials: true,
      origin: [process.env.FRONTENDPOINT]
    })
)

const users = []
let socketByUser = []

io.on('connection', (socket) => {
    
    const FindUser = cb => {
        const [found] = socketByUser.filter( item => item.id === socket.id )
        if( found ){
            socketByUser = socketByUser.filter( item => item.id !== socket.id)
            cb(found)
        }
    }


    socket.on('add_user', user => {
        users.push( user )
        socketByUser.push({id: socket.id, user})
        io.emit('users', users)
        io.emit('connected', socket.id)
    })

    socket.on('message', msg => {
        const res = {...msg, id: socket.id}
        io.emit('message', res)
    })

    socket.on('disconnect', ()=>{
        FindUser( (found)=> {
            const idx = users.indexOf(found.user)
            if(idx > -1 ) users.splice( idx, 1)
        })
        io.emit('users', users)
    })
    
    socket.on('change_username', data => {
        FindUser( found => {
            socketByUser.push({id: socket.id, user: data.username})
            const idx = users.indexOf(found.user)
            if(idx > -1 ) users[idx]= data.username
        })
        io.emit('users', users)
    })
})

app.use('/getTotalUsers', (_, res) => res.status(200).json({total: users.length}))

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`started on port: ${PORT}`))