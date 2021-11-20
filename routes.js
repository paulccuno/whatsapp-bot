const { Router } = require("express");
const { Client } = require("whatsapp-web.js");
const { withSession } = require("./whatsapp");

const router = Router();

router.post("/", (req, res) => {
  const { session, token } = req.body;
  console.log("body", session);
  let client;
  if (body) {
    client = withSession(session, token);
    return res.json({ success: true, data: client });
  }
  res.json({ success: false, data: client });
});

router.delete("/", (req, res) => {
  const { body } = req;
  console.log("session", body);

  if (body) {
    const client = new Client({ session: body });
    client.destroy();
    return res.json({ success: true, data: {} });
  }
  res.json({ success: false, data: {} });
});

module.exports = router;
