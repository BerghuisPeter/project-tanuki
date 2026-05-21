const messageHistory = [];
const MAX_HISTORY = 50;

const chatHandler = (io, socket) => {

  let previousRoomId;
  let currentUserId;
  let currentDisplayName;
  let currentColor;
  let currentAvatarUrl;

  const joinChatRoom = (roomId, userId, displayName, color, avatarUrl) => {
    currentUserId = userId;
    currentDisplayName = displayName;
    currentColor = color;
    currentAvatarUrl = avatarUrl;
    safeJoin(roomId, userId);

    socket.emit("chat:history", messageHistory);

    io.in(roomId).emit("chat:systemNotification", {
      user: {
        id: userId,
        displayName: displayName,
        color: color,
        avatarUrl: avatarUrl,
      },
      value: "globalChat.system.userJoined",
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
        avatarUrl: user.avatarUrl,
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
        avatarUrl: currentAvatarUrl,
      },
      value: "globalChat.system.userLeft",
      timestamp: Date.now()
    });
  }

  socket.on("chat:join", joinChatRoom);
  socket.on("chat:sendMessage", sendMessage);
  socket.once("disconnect", onDisconnect);
};
module.exports = chatHandler;
