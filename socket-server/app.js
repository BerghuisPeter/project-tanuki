const app = require('express')();
const http = require('http').Server(app);
const { Server } = require("socket.io");

const EXPOSED_PORT = process.env.PORT || 8000;
const CORS_DOMAIN = process.env.CORS_DOMAIN || "http://localhost:4200";

const io = new Server(http, {
  cors: {
    origin: CORS_DOMAIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
})

const registerChatHandlers = require("./chatHandler");
const registerBattleShipHandlers = require("./battleshipHandler");

const onConnection = (socket) => {
  console.log("connected! ", socket.id);
  registerChatHandlers(io, socket);
  registerBattleShipHandlers(io, socket);
}

io.on("connection", onConnection);

http.listen(EXPOSED_PORT, () =>
  console.log(`Listening on port ${EXPOSED_PORT}`)
);
