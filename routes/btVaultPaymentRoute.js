var express = require("express");
var btHelper = require("../helpers/braintreeHelper");
var router = express.Router();
var randomstring = require("randomstring");

// base route: bt/vault/payment

// #region Token Functions
router.get("/client_token", (req, res) => {
  btHelper.gateway.clientToken.generate({}).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

router.get("/client_token/:customerid", (req, res) => {
  const customerId = req.params.customerid;
  btHelper.gateway.clientToken.generate({ customerId: customerId }).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

// #endregion

// #region checkout Functions

router.post("/checkout", (req, res) => {
  var nonceFromTheClient = req.body.paymentMethodNonce;
  var amount = req.body.amount;
  const selectedCurrency = req.body.currency;

  // set merchantAccountId by selected presntment currency
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  btHelper.gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      //const fullResult = JSON.stringify(result)
      res.send(result);

    }
  );
});

router.post('/vault', (req, res, next) => {

  const selectedCurrency = req.body.currency;
  // set merchantAccountId by selected presntment currency
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  const saleRequest = {
    amount: req.body.amount,
    paymentMethodNonce: req.body.paymentMethodNonce,
    merchantAccountId: merchantAccountId,
    deviceData: req.body.deviceData || '',
    orderId: randomstring.generate(7), //"Mapped to PayPal Invoice Number",
    options: {
      submitForSettlement: true,
      storeInVaultOnSuccess: true,
      paypal: {
        customField: "PayPal custom field",
        description: "Description for PayPal email receipt",
      },
    },
    customer: {}
  };

  btHelper.gateway.transaction.sale(saleRequest).then(result => {
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


router.post("/checkout/localpaymethod", (req, res) => {
  var nonceFromTheClient = req.body.paymentMethodNonce;   //from client or from webhook 
  var amount = req.body.amount;
  var orderId = randomstring.generate(5);
  var descriptorName = "Eran Merchant US";
  const selectedCurrency = req.body.currency;
  // set merchantAccountId by selected presntment currency
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  btHelper.gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,
      orderId,
      //descriptorName: descriptorName,
      options: {
        submitForSettlement: true,
      },
    }).then(result => {
      if (result.success) {

        const message = "Success! Transaction ID: " + result.transaction.id;
        const response = { message, success: result.success, transaction: result.transaction };
        console.log(response);
        res.status(200).send(response);
      } else {
        const errMessage = "Error:  " + result.message;
        const errResponse = { message: errMessage, success: result.success, transaction: undefined };
        console.log(errResponse);
        res.status(400).send(errResponse);
      }
    }).catch(err => {
      console.log("Error:  " + err);
      res.status(500).send(err);
    });

});

// #endregion

module.exports = router;
