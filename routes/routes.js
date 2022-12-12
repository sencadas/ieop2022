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

router.get("/materials", async (req, res) => {
  let artigosList = [];
  const token = await getToken();
  //console.log(token);
  const config = {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
    "Content-Type": "application/json",
  };
  axios
    .get(
      `${URL}/api/${TENANT}/${ORGANIZATION}/materialscore/materialsitems`,
      config
    )
    .then((response) => {
      //console.log(response);
      response.data.forEach((livro) => {
        artigosList.push({
          itemKey: livro.itemKey,
          description: livro.description,
          stock: livro.materialsItemWarehouses[1].stockBalance,
        });
      });
      console.log("Pedido: ");
      console.log(artigosList);
      //res.send(artigosList);
    })
    .catch((error) => {
      console.log(error);
      res.send({
        status: error.status,
        message: error.message,
      });
    });
});

router.get("/salesitems", async (req, res) => {
  let artigosList = [];
  const token = await getToken();

  const config = {
    headers: { Authorization: `Bearer ${token.access_token}` },
    "Content-Type": "application/json",
  };
  axios
    .get(`${URL}/api/${TENANT}/${ORGANIZATION}/salescore/salesitems`, config)
    .then((response) => {
      //console.log(response);
      response.data.forEach((livro) => {
        console.log(livro.priceListLines);
        artigosList.push({
          name: livro.itemKey,
          description: livro.description,
          barcode: livro.barcode,
          priceAmount: livro.priceListLines.length
            ? livro.priceListLines[0].priceAmount.amount
            : null,
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
