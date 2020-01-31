const bodyParser = require("body-parser");
const api = require("./api");
module.exports = app => {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use("/api", api);
};
