const http = require('http')
const express = require('express')
const app = express()
const {Server} = require('socket.io')

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"https://chatnest-0tvr.onrender.com"
    }
})
const userSocketMap = {}
const getReceiverSocketId = (receiver) => {
    return userSocketMap[receiver]
}
io.on("connection",(socket)=> {
    // console.log(socket.id)
    // io.emit("hello","hello shubham")
    const userId = socket.handshake.query.userId
    console.log(userId)
    if(userId!=undefined){
        userSocketMap[userId] = socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    socket.on("disconnect",()=> {
        delete userSocketMap[userId] 
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})





module.exports = {
    app,
    server,
    io,
    getReceiverSocketId
}