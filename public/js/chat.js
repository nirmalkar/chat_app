const socket = io()

socket.on("countUpdated", (count) => {
  console.log(`The count has been updated is ${count}`)
})

document.querySelector("#increment").addEventListener("click", () => {
  console.log("clicked")
  socket.emit("increment")
})