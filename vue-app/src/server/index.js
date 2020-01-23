const { resolve } = require("path");
const history = require("connect-history-api-fallback");
const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;

const publicPath = resolve(__dirname, "../../dist");
const staticConf = { maxAge: "1y", etag: false };
app.use(express.static(publicPath, staticConf));
app.use("/", history());
app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
