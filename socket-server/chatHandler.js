const messageHistory = [];
const MAX_HISTORY = 50;

const chatHandler = (io, socket) => {

  let previousRoomId;
  let currentUserId;
  let currentDisplayName;
  let currentColor;

  const joinChatRoom = (roomId, userId, displayName, color) => {
    currentUserId = userId;
    currentDisplayName = displayName;
    currentColor = color;
    safeJoin(roomId, userId);

    socket.emit("chat:history", messageHistory);

    io.in(roomId).emit("chat:systemNotification", {
      user: {
        id: userId,
        displayName: displayName,
        color: color,
      },
      value: "graced us with their presence.",
      timestamp: Date.now()
    });
  }

  const safeJoin = (roomId, userId) => {
    socket.leave(previousRoomId);
    console.log(`${userId} (socket: ${socket.id}) is in room ${roomId}`);
    socket.join(roomId);
    previousRoomId = roomId;
  }

  const sendMessage = (payload) => {
    const { roomId, user, message: messageValue } = payload;
    const message = {
      user: {
        id: user.userId,
        displayName: user.displayName,
        color: user.color,
      },
      value: messageValue,
      timestamp: Date.now()
    };

    // Save to history, keep only last 50
    messageHistory.push(message);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }

    io.in(roomId).emit("chat:receiveMessage", message);
  }

  const onDisconnect = () => {
    console.log("disconnect ", socket.id);
    socket.broadcast.emit("chat:systemNotification", {
      user: {
        id: currentUserId,
        displayName: currentDisplayName,
        color: currentColor,
      },
      value: "has left the building !",
      timestamp: Date.now()
    });
  }

  socket.on("chat:join", joinChatRoom);
  socket.on("chat:sendMessage", sendMessage);
  socket.once("disconnect", onDisconnect);
};
module.exports = chatHandler;
