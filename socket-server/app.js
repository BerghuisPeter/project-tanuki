const app = require('express')();
const http = require('node:http').Server(app);
const { Server } = require("socket.io");

const EXPOSED_PORT = process.env.PORT || 8000;
const cors_origin_env = process.env.CORS_DOMAIN || process.env.APP_CORS_ALLOWED_ORIGINS;
const CORS_DOMAIN = cors_origin_env ?
  cors_origin_env.split(/[ ,;]+/).flatMap(d => {
    const trimmed = d.trim();
    if (!trimmed) return [];
    return trimmed.endsWith('/') ? [trimmed, trimmed.slice(0, -1)] : [trimmed, trimmed + '/'];
  })
  : "http://localhost:4200";

const io = new Server(http, {
  cors: {
    origin: CORS_DOMAIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

console.log('Allowed Origins:', CORS_DOMAIN);

app.get('/health', (req, res) => {
  res.send('OK');
})

const registerChatHandlers = require("./chatHandler");

const onConnection = (socket) => {
  console.log("connected! ", socket.id);
  registerChatHandlers(io, socket);
}

io.on("connection", onConnection);

http.listen(EXPOSED_PORT, () =>
  console.log(`Listening on port ${EXPOSED_PORT}`)
);
