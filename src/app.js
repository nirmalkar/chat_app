const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const axios = require("axios")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))

let message = "Welcome"

io.on("connection", (socket) => {
  console.log("New Websocket connection")
  socket.emit("message", message)
  socket.broadcast.emit("message", "A new user has joined")
  socket.on("sendMessage", (message) => {
    io.emit("message", message)
  })
  socket.on("disconnect", () => {
    io.emit("message", "A user has left!")
  })
  socket.on("sendLocation", (coord) => {
    io.emit("message", `https://google.com/maps?q=${coord.latitude},${coord.longitude}`)
  })
})
server.listen(port, () => {
  console.log(`server is active at port ${port}`)
})