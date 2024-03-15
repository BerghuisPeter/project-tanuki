module.exports = (io, socket) => {

  console.log("connected! ", socket.id);
  let previousRoomId;

  const joinChatRoom = (chatRoomName) => {
    safeJoin(chatRoomName);
    io.in(chatRoomName).emit("chat:systemNotification", `${socket.id} graced us with his presence.`);
  }

  const safeJoin = (roomId) => {
    socket.leave(previousRoomId);
    console.log(`NEW ${socket.id} is in room ${roomId}`);
    socket.join(roomId);
    previousRoomId = roomId;
  }

  const sendMessage = (roomName, value) => {
    io.in(roomName).emit("chat:receiveMessage", { user: socket.id, value });
  }

  const onDisconnect = () => {
    console.log("disconnect ", socket.id);
    socket.broadcast.emit("chat:systemNotification", `${socket.id} has left the building !`);
  }

  socket.on("chat:join", joinChatRoom);
  socket.on("chat:sendMessage", sendMessage);
  socket.once("disconnect", onDisconnect);
}
