const request = require("request");
const {
  URL,
  TENANT,
  ORGANIZATION,
  COMPANY_KEY,
  TOKEN_KEY,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env;

function getToken() {
  let token;
  request(
    {
      url: "https://identity.primaverabss.com/connect/token",
      method: "POST",
      auth: {
        user: CLIENT_ID, // TODO : put your application client id here
        pass: CLIENT_SECRET, // TODO : put your application client secret here
      },
      form: {
        grant_type: "client_credentials",
        scope: "application",
      },
    },
    function (err, res) {
      if (res) {
        // console.log("Access Token:", res.body);
        token = JSON.parse(res.body);
      } else {
        console.log("Could not obtain acess token.");
      }
    }
  );
  return new Promise(function (resolve, reject) {
    // Only `delay` is able to resolve or reject the promise
    setTimeout(function () {
      resolve(token); // After 3 seconds, resolve the promise with value 42
    }, 3000);
  });
}

exports.getToken = getToken;
