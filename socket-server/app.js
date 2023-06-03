const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  // console.log(socket.request._query['userName']);
  console.log("connected! ", socket.id);
  let previousId;
  const safeJoin = (roomId) => {
    socket.leave(previousId);
    console.log(`NEW ${socket.id} is in room ${roomId}`)
    socket.join(roomId);
    previousId = roomId;
  };

  socket.once("disconnect", () => {
    console.log("disconnect ", socket.id);
    socket.broadcast.emit("message", { user: null, value: `${socket.id} has left the building !` });
  });

  socket.on("joinChat", (chatRoomName) => {
    safeJoin(chatRoomName);
    io.in(chatRoomName).emit("message", { user: null, value: `${socket.id} joined our forsaken people.` });
  });

  socket.on("sendMessage", (roomName, value) => {
    io.in(roomName).emit("message", { user: username, value });
  });
});

http.listen(4444, () => {
  console.log('Listening on port 4444');
});
