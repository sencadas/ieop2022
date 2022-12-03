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
const { getToken } = require("../utils/utils.js");

router.get("/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://identity.primaverabss.com/connect/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Connection: "keep-alive",
        },
      },
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
        form: {
          grant_type: "client_credentials",
          scope: "application",
        },
      }
    );
    console.log(response);
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/materials", async (req, res) => {
  let artigosList = [];
  const token = await getToken();
  console.log(token);
  const config = {
    headers: { Authorization: `Bearer ${token.access_token}` },
    "Content-Type": "application/json",
  };
  axios
    .get(
      `${URL}/api/${TENANT}/${ORGANIZATION}/materialscore/materialsitems`,
      config
    )
    .then((response) => {
      console.log(response);
      response.data.forEach((livro) => {
        artigosList.push({
          name: livro.itemKey,
          description: livro.description,
        });
      });
      res.send(artigosList);
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
