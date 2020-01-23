var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.send("TEST");
});

router.post("/getDictionary", (req, res) => {
  var params = JSON.parse(req.body.params);
  var { dictionaryName } = params;

  var data = require(`./data/${dictionaryName}.json`);

  setTimeout(() => {
    res.status("200").json(data);
    res.end();
  }, 200);
});
module.exports = router;
