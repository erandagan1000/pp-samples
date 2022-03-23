var express = require("express");
var btHelper = require("../helpers/braintreeHelper");
var router = express.Router();

router.get("/client_token", (req, res) => {
  btHelper.gateway.clientToken.generate({}).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

router.post("/checkout", (req, res) => {
  var nonceFromTheClient = req.body.payment_method_nonce;

  // set merchantAccountId by selected presntment currency
  const selectedCurrency = req.body.currency;
  let merchantAccountId = undefined;
  if(selectedCurrency){
    console.log(selectedCurrency);
    merchantAccountId = selectedCurrency == 'EUR' ? "eranltd-europe" : "eranltd"; 
  } 
  console.log(merchantAccountId);

  btHelper.gateway.transaction.sale(
    {
      amount: "20.00",
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
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
