const configureAPI = require("./src/server/configure");

module.exports = {
  devServer: {
    before: configureAPI,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept"
    },
    open: process.env.VUE_DEVSERVER_OPEN,
    compress: true
  },
  transpileDependencies: ["vuetify"]
};
