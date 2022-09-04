var express = require("express");
var btHelper = require("../helpers/braintreeHelper");
var router = express.Router();

router.get("/client_token/3ds", (req, res) => {
  // see here: https://developer.paypal.com/braintree/docs/reference/request/client-token/generate
  // it is possible to specify merchantAcountId if merchant wants to control the display button or use 3DS
  btHelper.gateway.clientToken.generate({merchantAccountId: 'eranltd_EUR'}).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

router.get("/client_token", (req, res) => {
  // see here: https://developer.paypal.com/braintree/docs/reference/request/client-token/generate
  // it is possible to specify merchantAcountId if merchant wants to control the display button or use 3DS
  btHelper.gateway.clientToken.generate({}).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

router.post("/checkout", (req, res) => {
  var nonceFromTheClient = req.body.payment_method_nonce;
  var storeInVault =  (req.body.hf_save_for_next_purchase && req.body.hf_save_for_next_purchase == 'true') || false; 
  var maid = req.body.maid;
  console.log("storeInVault" ,storeInVault);
  // set merchantAccountId by selected presntment currency
  const selectedCurrency = req.body.currency;
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);
 
  console.log(merchantAccountId);
  if (maid) {
    merchantAccountId = maid;
  }

  btHelper.gateway.transaction.sale(
    {
      amount: "20.00",
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
      // deviceData: deviceDataFromTheClient,
      
      options: {
        submitForSettlement: true,
        storeInVaultOnSuccess: storeInVault,
      },
    },
    (err, result) => {
        const fullResult = `<div><a href="/">Home</a></div><br/><h2>CUSTOMER ID: ${result.transaction.customer.id}</h2><div>${JSON.stringify(result)}</div>`
        res.send(fullResult);
      
    }
  );
});

module.exports = router;
