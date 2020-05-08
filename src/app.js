const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const axios = require("axios")
const Filter = require("bad-words")

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
  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!")
    }
    io.emit("message", message)
    callback("delivered!")
  })
  socket.on("disconnect", () => {
    io.emit("message", "A user has left!")
  })
  socket.on("sendLocation", (coord, callback) => {
    io.emit("message", `https://google.com/maps?q=${coord.latitude},${coord.longitude}`)
    callback()
  })
})
server.listen(port, () => {
  console.log(`server is active at port ${port}`)
})