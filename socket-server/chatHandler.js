const chatHandler = (io, socket) => {

  let previousRoomId;
  let currentUserId;

  const joinChatRoom = (roomId, userId) => {
    currentUserId = userId;
    safeJoin(roomId, userId);
    io.in(roomId).emit("chat:systemNotification", { user: currentUserId, value: "graced us with their presence." });
  }

  const safeJoin = (roomId, userId) => {
    socket.leave(previousRoomId);
    console.log(`${userId} (socket: ${socket.id}) is in room ${roomId}`);
    socket.join(roomId);
    previousRoomId = roomId;
  }

  const sendMessage = (roomId, userId, value) => {
    io.in(roomId).emit("chat:receiveMessage", { user: userId, value });
  }

  const onDisconnect = () => {
    console.log("disconnect ", socket.id);
    socket.broadcast.emit("chat:systemNotification", { user: currentUserId, value: "has left the building !" });
  }

  socket.on("chat:join", joinChatRoom);
  socket.on("chat:sendMessage", sendMessage);
  socket.once("disconnect", onDisconnect);
};
module.exports = chatHandler;
