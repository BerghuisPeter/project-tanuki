const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("connected! ", socket.id);
  let previousRoomId;
  const safeJoin = (roomId) => {
    socket.leave(previousRoomId);
    console.log(`NEW ${socket.id} is in room ${roomId}`)
    socket.join(roomId);
    previousRoomId = roomId;
  };

  socket.once("disconnect", () => {
    console.log("disconnect ", socket.id);
    socket.broadcast.emit("systemNotification", `${socket.id} has left the building !`);
  });

  socket.on("joinChat", (chatRoomName) => {
    safeJoin(chatRoomName);
    io.in(chatRoomName).emit("systemNotification", `${socket.id} joined our forsaken people.`);
  });

  socket.on("sendMessage", (roomName, value) => {
    io.in(roomName).emit("message", { user: socket.id, value });
  });
});

http.listen(4444, () => {
  console.log('Listening on port 4444');
});
