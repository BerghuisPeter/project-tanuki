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
  console.log("connected!");
  let previousId;
  let username;
  const safeJoin = (newUser, currentId) => {
    socket.leave(previousId);
    socket.join(currentId, () => console.log(`NEW ${socket.id} is in room ${currentId}`));
    previousId = currentId;
    username = newUser;
  };

  socket.once("disconnect", () => {
    console.log("disconnect ", username);
    socket.broadcast.emit("message", { user: null, value: `${username} has left the building !` });
  });

  socket.on("joinChat", (newUser, chatRoomName) => {
    safeJoin(newUser, chatRoomName);
    io.in(chatRoomName).emit("message", { user: null, value: `${newUser} joined our forsaken people.` });
  });

  socket.on("sendMessage", (chatRoomName, value) => {
    io.in(chatRoomName).emit("message", { user: username, value });
  });
});

http.listen(4444, () => {
  console.log('Listening on port 4444');
});
