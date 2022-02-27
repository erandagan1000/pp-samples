var express = require("express");
var gateway = require("../helpers/braintreeHelper");
var router = express.Router();

router.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

router.post("/checkout", (req, res) => {
  var nonceFromTheClient = req.body.payment_method_nonce;
  gateway.transaction.sale(
    {
      amount: "20.00",
      paymentMethodNonce: nonceFromTheClient,
      // deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      console.log(result.status);
      const fullResult = `<div><a href="/">Home</a></div><div>${JSON.stringify(result)}</div>`
        res.send(fullResult);
      
    }
  );
});

module.exports = router;