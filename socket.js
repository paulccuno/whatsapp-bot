const { withOutSession, withSession } = require("./whatsapp");

module.exports.onConnection = (socket) => {
  const { handshake } = socket;
  const { user, session } = handshake.auth;
  console.log("session", session);
  let client;
  console.log(`Nueva conexion ${user.username}`);
  if (session) {
    // client = withSession(socket, session);
  } else {
  }
  client = withOutSession(socket);

  socket.on("disconnect", () => {
    client.destroy();
    console.log(`Usuario ${user.username} desconectado`);
  });
};
