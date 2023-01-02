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
        if (livro.materialsItemWarehouses[1].stockBalance > 0) {
          artigosList.push({
            itemKey: livro.itemKey,
            description: livro.description,
            stock: livro.materialsItemWarehouses[1].stockBalance,
            price: livro.materialsItemWarehouses[1].calculatedUnitCost.amount,
          });
        }
      });
      console.log("Pedido: ");
      console.log(artigosList);
      res.send({ listaLivros: artigosList });
    })
    .catch((error) => {
      console.log(error);
      res.send({
        status: error.status,
        message: error.message,
      });
    });
});

router.post("/invoices", async (req, res) => {
  const token = await getToken();
  //console.log(token);
  const config = {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
    "Content-Type": "application/json",
  };
  let date = new Date("12/30/2022");

  const { itemKey, description, quantity, unitPrice, emailTo } = req.body;

  console.log(date);

  const body = {
    documentType: "FA",
    serie: "2022",
    seriesNumber: 1,
    company: "Default",
    paymentTerm: "01",
    paymentMethod: "NUM",
    currency: "EUR",
    documentDate: date,
    postingDate: date,
    emailTo: emailTo,
    buyerCustomerParty: "INDIF",
    buyerCustomerPartyName: "Cliente Indiferenciado",
    //"accountingPartyName": "Sofrio, Lda.",
    //"accountingPartyTaxId": "593362462",
    exchangeRate: 1,
    discount: 0,
    loadingCountry: "PT",
    unloadingCountry: "PT",
    isExternal: false,
    isManual: false,
    isSimpleInvoice: false,
    isWsCommunicable: false,
    deliveryTerm: "V-VIATURA",
    documentLines: [
      {
        salesItem: itemKey,
        description: description,
        warehouse: "PO",
        quantity: quantity,
        unitPrice: {
          amount: unitPrice,
          baseAmount: unitPrice,
          reportingAmount: unitPrice,
          fractionDigits: 2,
          symbol: "€",
        },
        unit: "UN",
        itemTaxSchema: "NORMAL",
        deliveryDate: date,
      },
    ],
    WTaxTotal: {
      amount: 0,
      baseAmount: 0,
      reportingAmount: 0,
      fractionDigits: 2,
      symbol: "€",
    },
    TotalLiability: {
      baseAmount: 0,
      reportingAmount: 0,
      fractionDigits: 2,
      symbol: "€",
    },
  };

  axios
    .post(`${URL}/api/${TENANT}/${ORGANIZATION}/billing/invoices`, body, config)
    .then((response) => {
      console.log(response);
      res.send({
        status: true,
        message: "Fatura emitida",
        data: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({
        status: false,
        message: error.message,
        data: error.response.data,
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
