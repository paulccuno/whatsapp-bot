const express = require("express");
const { Server: SocketServer } = require("socket.io");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");

const { PORT } = require("./env");

const routes = require("./routes");

const { onConnection } = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/", routes);

io.on("connection", onConnection);

server.listen(PORT, () => {
  console.log(`Sever on port http://localhost:${PORT}`);
});
