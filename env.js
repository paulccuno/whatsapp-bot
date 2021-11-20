const dotenv = require("dotenv");

dotenv.config();

module.exports.API_URL = process.env.API_URL;
module.exports.PORT = process.env.PORT;
