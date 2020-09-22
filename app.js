require('dotenv').config()
const express = require('express')
const http = require('http');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const router = require('./src/routers')
const auth = require('./src/middlewares/auth')
const modelMessages = require('./src/models/messages')
const helper = require('./src/helpers/helpers')

const app = express();
const server = http.createServer(app)

const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=>{
    console.log(`Server in running 🚨 🚨 to PORT ${PORT}`)
})
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const io = socket(server)

io.on('connection', socket => {
    console.log('connect')
    socket.on('setupLogin', async ({id, token}, callback)=>{
        console.log('setupLogin', id)
        console.log(id, token)
        const result = auth.cekToken(id, token)
        console.log(result)
        if(result.error) return callback(result)
        
            try {
                const messages = await modelMessages.getUserbymessage(id)
                const resultUserList = helper.fillterMessageByUser(messages)
                callback({
                    error: false,
                    listUser: resultUserList
                })
            } catch (error) {
                console.log(error)
            }
        socket.join(`user:${id}`)
        console.log('test')
        socket.emit('test', `user id ini sendang join ${id}`)
    })
    socket.on('getMessagePrivate', async (id, callback)=>{
        try {
            console.log(id)
            const messages = await modelMessages.getMessagePrivate(id)
            // console.log(messages)
            callback({error: false,
                    messages})
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('getMessagePrivate', async (id, callback)=>{
        try {
            const messages = await modelMessages.getMessagePrivate(id)
            // console.log(messages)
            callback({error: false,
                    messages})
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('sendMessage', ({messageBody, senderId, receiverId}, callback) => {
        const data = {
            messageBody,
            senderId,
            receiverId,
            status: 1,
            createdAt: new Date()
        }
        callback({...data, id: helper.generateId})
        modelMessages.SendMessagePrivate(data)
        .then(()=>{
            console.log(data)
            io.to(`user:${receiverId}`).emit('receiverMsg', data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    socket.on('disconnect', ()=>{
        console.log('disconnect')
    })
})

app.use('/api/v1', router)
