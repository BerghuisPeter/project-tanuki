module.exports = (io, socket) => {

  let previousRoomId;

  const joinChatRoom = (chatRoomName) => {
    safeJoin(chatRoomName);
    io.in(chatRoomName).emit("bs:systemNotification", `${socket.id} graced us with his presence.`);
  }

  const safeJoin = (roomId) => {
    socket.leave(previousRoomId);
    console.log(`NEW ${socket.id} is in room ${roomId}`);
    socket.join(roomId);
    previousRoomId = roomId;
  }

  const sendMessage = (roomName, value) => {
    io.in(roomName).emit("bs:receiveMessage", { user: socket.id, value });
  }

  const onDisconnect = () => {
    console.log("disconnect ", socket.id);
    socket.broadcast.emit("bs:systemNotification", `${socket.id} has left the building !`);
  }

  socket.on("bs:join", joinChatRoom);
  socket.on("bs:sendMessage", sendMessage);
  socket.once("disconnect", onDisconnect);
}
