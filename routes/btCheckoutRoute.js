
const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const gateway = require("../helpers/braintreeHelper");

router.post('/', (req, res, next) => {
  // const gateway = new braintree.BraintreeGateway({
  //   environment: braintree.Environment.Sandbox,
  //   // Use your own credentials from the sandbox Control Panel here
  //   merchantId: '8n5hz5rwnb656jks',
  //   publicKey: 'y7254zqncx2hnm52',
  //   privateKey: '26303b7ff60ab3ebe401e22b172d972e'
  // });


  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  const newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, (error, result) => {
      if (result) {
        result.homeURl = "/";
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;