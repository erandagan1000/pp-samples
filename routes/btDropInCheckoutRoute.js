
const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const btHelper = require("../helpers/braintreeHelper");

// base route: /bt/di/checkout

router.post('/', (req, res, next) => {
  
  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const selectedCurrency = req.body.currency;
  // set merchantAccountId by selected presntment currency
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);
 
  // Create a new transaction for $10
  const newTransaction = btHelper.gateway.transaction.sale({
    amount: '10.00',
    merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
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