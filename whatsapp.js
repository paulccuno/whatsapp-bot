const { default: axios } = require("axios");
const { Client } = require("whatsapp-web.js");
const { API_URL } = require("./env");

const sendMessage = (client, number, msg) => {
  client.sendMessage(number, msg);
};

module.exports.withOutSession = (socket) => {
  const client = new Client();
  client.on("qr", (qr) => {
    console.log("qr", qr);
    socket.emit("qr", qr);
  });
  client.on("authenticated", (session) => {
    socket.emit("authenticated", session);
    client.destroy();
    console.log("autenticado");
  });
  client.initialize().catch((err) => {
    client.destroy();
  });
  return client;
};

module.exports.withSession = (session, token) => {
  const client = new Client({ session });

  client.on("ready", () => {
    console.log("Estoy ready");
    // socket.emit("ready", "escuchando mensajes");

    client.on("message", async (msg) => {
      const { from, to, body } = msg;
      const contact = await client.getContactById(from);
      const { pushname, number } = contact;

      console.log(msg);

      const { data } = await axios({
        url: `${API_URL}/LEADS/detailLEAD/${number}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) return;

      await axios({
        url: `${API_URL}/LEADS/createLEAD/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          Nombre: null,
          Apellido: pushname,
          Telefono: number,
          Email: null,
          Empresa: null,
          Web: null,
          Num_Emple: null,
          Factur_Anu: null,
          Sector_Empres: null,
          Cargo_Empr: null,
          Fuen_Pos: null,
          Prod_Inte: null,
          Experien: null,
          Comentario: null,
          Assignedto: null,
          DateCreate: new Date(),
          DateAssigned: new Date(),
          CreatedBy: 1,
        },
      });

      // socket.emit("message", { contact, msg });
    });
  });

  client.on("auth-failure", () => {
    client.destroy();
  });

  client.initialize().catch((err) => {
    client.destroy();
  });
  return client;
};
