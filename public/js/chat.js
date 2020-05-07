const socket = io()

socket.on("message", (message) => {
  console.log(message)
})

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault()
  const message = e.target.elements.message.value
  socket.emit("sendMessage", message)
})

document.querySelector("#sendLocation").addEventListener("click", (e) => {
  e.preventDefault()
  if (!navigator.geolocation) {
    return alert("Geo location is not supported by your browser.")
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit("sendLocation", {
      latitude,
      longitude
    })
  })
})