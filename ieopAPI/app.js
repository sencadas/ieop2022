var express = require("express");
var app = express();
require("dotenv").config();
const routes = require("./routes/routes");

app.use(express.json());

app.use("/api/", routes);

//para iniciar: node app.js

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
