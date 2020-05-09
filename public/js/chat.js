const socket = io()

// Elements 
const messageForm = document.querySelector("#message-form")
const messageFormInput = messageForm.querySelector("input")
const messageFormButton = messageForm.querySelector("button")
const sendLocation = document.querySelector("#sendLocation")
const messages = document.querySelector("#messages")

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML

socket.on("message", (message) => {
  console.log(message.text, message.createdAt)
  const html = Mustache.render(messageTemplate, {
    message: `${moment(message.createdAt).format("h:mm a")}  ${message.text}`,
  })
  messages.insertAdjacentHTML("beforeend", html)
})
socket.on("locationMessage", (url) => {
  console.log(url)
  const html = Mustache.render(locationMessageTemplate, {
    url: url.text,
    time: moment(url.createdAt).format("h:mm a")
  })
  messages.insertAdjacentHTML("beforeend", html)
})
messageForm.addEventListener("submit", (e) => {
  e.preventDefault()
  messageFormButton.setAttribute("disabled", "disabled")
  messageFormInput.focus()

  const message = e.target.elements.message.value
  socket.emit("sendMessage", message, (err) => {
    messageFormButton.removeAttribute("disabled")
    messageFormInput.value = ""
    if (err) {
      console.log(err)
    } else {
      console.log("message delivered!")
    }
  })
})

sendLocation.addEventListener("click", (e) => {
  e.preventDefault()
  sendLocation.setAttribute("disabled", "disabled")
  if (!navigator.geolocation) {
    return alert("Geo location is not supported by your browser.")
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit("sendLocation", {
      latitude,
      longitude
    }, () => {
      console.log("Location shared successfully")
      sendLocation.removeAttribute("disabled")
    })
  })
})