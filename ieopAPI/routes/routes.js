const express = require("express");
const router = express.Router();
const {
  URL,
  TENANT,
  ORGANIZATION,
  COMPANY_KEY,
  TOKEN_KEY,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env;
const axios = require("axios");

const config = {
  headers: { Authorization: `Bearer ${TOKEN_KEY}` },
};

router.get("/token", async (req, res) => {
  const body = {
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
  };
  const response = await axios.post(
    "https://identity.primaverabss.com/connect/token",
    body
  );
  console.log(response);
  res.send(response);
});

router.get("/materials", async (req, res) => {
  axios
    .get(
      `${URL}/api/${TENANT}/${ORGANIZATION}/materialscore/materialsitems`,
      config
    )
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.send({
        status: error.status,
        message: error.message,
      });
    });
});

module.exports = router;
