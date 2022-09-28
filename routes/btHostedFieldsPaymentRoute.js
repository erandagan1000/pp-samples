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

  const amount = req.body.isDesiredToBeDeclined == 'true' ? "2001.00" : "122.00"

  btHelper.gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
      // deviceData: deviceDataFromTheClient,
      // customer: {
      //   firstName: "Jen",
      //   lastName: "Smith",
      //   company: "Braintree",
      //   email: "jen@example.com",
      //   phone: "312.555.1234",
      //   fax: "614.555.5678",
      //   website: "www.example.com"
      // },
      // billing: {
      //   firstName: "Paul",
      //   lastName: "Smith",
      //   company: "Braintree",
      //   streetAddress: "1 E Main St",
      //   extendedAddress: "Suite 403",
      //   locality: "Chicago",
      //   region: "IL",
      //   postalCode: "60622",
      //   countryCodeAlpha2: "US"
      // },
      shipping: {
        firstName: "Jen",
        lastName: "Smith",
        company: "Braintree",
        streetAddress: "1 E 1st St",
        extendedAddress: "5th Floor",
        locality: "Bartlett",
        region: "IL",
        postalCode: "60103",
        countryCodeAlpha2: "US"
      },
      options: {
        submitForSettlement: true,
        storeInVaultOnSuccess: storeInVault,   
        storeShippingAddressInVault: true    
      }
            
    },
    (err, result) => {
        const fullResult = `<div><a href="/">Home</a></div><br/><h2>CUSTOMER ID: ${result.transaction.customer.id}</h2><div>${JSON.stringify(result)}</div>`
        res.send(fullResult);
      
    }
  );
});

module.exports = router;
