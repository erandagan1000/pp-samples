var express = require("express");
var gateway = require("../helpers/braintreeHelper");
var router = express.Router();
var randomstring = require("randomstring");

// base route: bt/vault/payment

router.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

router.get("/client_token/:customerid", (req, res) => {
  const customerId = req.params.customerid;
  gateway.clientToken.generate({customerId: customerId}).then((response) => {
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

router.post('/vault', (req, res, next) => {

  const saleRequest = {
    amount: req.body.amount,
    paymentMethodNonce: req.body.paymentMethodNonce,
    deviceData: req.body.deviceData || '',
    orderId: randomstring.generate(7), //"Mapped to PayPal Invoice Number",
    options: {
      submitForSettlement: true,
      storeInVaultOnSuccess: true,
      paypal: {
        customField: "PayPal custom field",
        description: "Description for PayPal email receipt",
      },
    }
  };
  
  gateway.transaction.sale(saleRequest).then(result => {
    if (result.success) {
      console.log("Success! Transaction ID: " + result.transaction.id);
      res.status(200).send(result);
    } else {
      console.log("Error:  " + result.message);
    }
  }).catch(err => {
    console.log("Error:  " + err);
    res.status(500).send(err)
  });


});

router.post('/checkout/vault', (req, res, next) => {});

module.exports = router;
