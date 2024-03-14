const app = require('express')();
const http = require('http').Server(app);
const EXPOSED_PORT = process.env.PORT || 3333;
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
})

const registerChatHandlers = require("./chatHandler");

const onConnection = (socket) => {
  registerChatHandlers(io, socket);
}

io.on("connection", onConnection);

http.listen(EXPOSED_PORT, () =>
  console.log(`Listening on port ${EXPOSED_PORT}`)
);
