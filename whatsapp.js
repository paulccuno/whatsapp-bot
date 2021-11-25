const axios = require("axios");
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

    client.on("message", async (msg) => {
      const { from } = msg;
      const contact = await client.getContactById(from);
      const { pushname, number } = contact;

      const { data } = await axios({
        method: "GET",
        url: `${API_URL}/LEADS/ListLEADcell/${number}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) return;

      const newLead = {
        Nombre: "",
        Apellido: pushname,
        Telefono: number,
        Email: "",
        Empresa: "",
        Web: "",
        Num_Emple: "",
        Factur_Anu: "",
        Sector_Empres: "",
        Cargo_Empr: "",
        Fuen_Pos: "",
        Prod_Inte: "",
        Experien: "No. ",
        Comentario: "",
        Assignedto: 1,
        DateCreate: new Date(),
        DateAssigned: new Date(),
        CreatedBy: 1,
      };

      await axios({
        method: "POST",
        url: `${API_URL}/LEADS/createLEAD/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: newLead,
      });
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
