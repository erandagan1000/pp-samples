var express = require("express");
const { reset } = require("nodemon");
var btHelper = require("../helpers/braintreeHelper");
var router = express.Router();
const axios = require('axios').default;
const ppApiHelperV2 = require('../helpers/ppApiHelperV2')

// /bt/hf/payment

router.get("/client_token/3ds", (req, res) => {
  // see here: https://developer.paypal.com/braintree/docs/reference/request/client-token/generate
  // it is possible to specify merchantAcountId if merchant wants to control the display button or use 3DS
  btHelper.gateway.clientToken.generate({ merchantAccountId: 'eranltd_EUR' }).then((response) => {
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
  
  var useNonce = req.query.dontUseNonce != '1';
  var nonceFromTheClient = req.body.payment_method_nonce;
  var storeInVaultOnsuccess = (req.body.hf_save_for_next_purchase && req.body.hf_save_for_next_purchase == 'true') || false;
  var maid = req.body.maid;
  console.log("nonce: "+ nonceFromTheClient);
  console.log("storeInVaultOnsuccess", storeInVaultOnsuccess);
  // set merchantAccountId by selected presntment currency
  const selectedCurrency = req.body.currency;
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  console.log(merchantAccountId);
  if (maid) {
    merchantAccountId = maid;
  }

  const amount = req.body.isDesiredToBeDeclined == 'true' ? "2001.00" : "122.00"
 
  if(useNonce){
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
          storeInVaultOnSuccess: storeInVaultOnsuccess,
          // storeShippingAddressInVault: true    
        }
  
      },
      (err, result) => {
  
        const fullResult = `<div><a href="/">Home</a></div><br/><h2>CUSTOMER ID: ${storeInVaultOnsuccess ? result.transaction.customer.id : "None"}</h2><div>${JSON.stringify(result)}</div>`
        res.send(fullResult);
  
      }
    );

  }
  
});

router.post("/forward/pp", (req, res) => {
  var nonceFromTheClient = req.body.payment_method_nonce;

  var maid = req.body.maid;

  // set merchantAccountId by selected presntment currency
  const selectedCurrency = req.body.currency;
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  console.log(merchantAccountId);
  if (maid) {
    merchantAccountId = maid;
  }

  //headers
  const options = {
    auth: {
      username: process.env.BT_PUBLIC_KEY,
      password: process.env.BT_PRIVATE_KEY
    }
  };
  
  accessToken = "Bearer A21AAJPtcE_iPE6Yr7UxsHLYDAsfdmSWO3og849fPL3x-mhjRAvH7dPKp6PF9W9Neu3jSiUrGrLOhCuPfxGsaNtZlyfyp-9sg";
  clientMetaDataId = ppApiHelperV2.uuidv4();
  let config = {
    headers: {
      "Authorization": accessToken,
      "PAYPAL-CLIENT-METADATA-ID": clientMetaDataId
    }
  };

  //payload to the target API
  const requestBody = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "115.00"
        }
      }
    ]
  };

  data = {
    //debug_transformations: true,
    merchant_id: process.env.BT_MERCHANT_ID,
    payment_method_nonce: "fake-valid-nonce",
    url: "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    method: "POST",
    config: {
      name: "inline_example",
      template: {
        header: config.headers,
        body: requestBody
      },
      methods: ["POST"],
      url: "^https://api-m\\.sandbox\\.paypal\\.com/v2/checkout/orders$",
      //request_format: {"/body": "urlencode"},   
      types: ["CreditCard"],
      transformations: [{
        "path": "/body/verify/credit_card/number",
        "value": "$number"
      }]
    }
  }

  axios.post('https://forwarding.sandbox.braintreegateway.com', data, options)
    .then(function (response) {
      // handle success
      const data = response.data;
      res.send(data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.send(error.response.data);
    });
});

router.post("/forward/uat", (req, res) => {
  
  const cvvOnlyNonce = req.body.cvvOnlyNonce;
  //headers
  const options = {
    auth: {
      username: process.env.BT_PUBLIC_KEY,
      password: process.env.BT_PRIVATE_KEY
    }
  };

  //payload to the target API
  hwUserToken ="usr-945b1789-30a4-4e6a-9fa8-b1ed87c80787";

  //setup:
  // 1- take cutomer from vault, obtain his payment_method_token
  // 2- create a CVV-only nonce with client SDK (dont use it in transaction.sale) - use this: http://localhost:3000/bthfcvvon
  // 3- build the forward-api call as it appears here: https://developer.paypal.com/braintree/docs/guides/extend/forward-api/examples#cvv-with-vaulted-card-data 

  data = {
    merchant_id: process.env.BT_MERCHANT_ID,
    payment_method_token: "kykgpd8f",   //braintree_payment_method_token
    payment_method_nonce: cvvOnlyNonce, // a CVV only nonce 
    sensitive_data: {
        user: process.env.Hyperwallet_username,
        password: process.env.hyperwallet_password,
    },
    data:{
        transferMethodCountry: "GB",
        transferMethodCurrency: "GBP",
    },
    url: `https://uat-api.paylution.com/rest/v4/users/${hwUserToken}/bank-cards/`,
    method: "POST",
    configs: [{
       name: "progressplay_sb_hyperwallet_bankcards",
       methods: ["POST", "PUT"],
       url: "^https:\/\/uat-api.paylution.com\/rest\/v4\/users\/.*\/bank-cards\/.*$",
       request_format: {"/body": "json"},
       types: ["CreditCard"],
       transformations: [
               {"path": "/header/Authorization",
                   "value": ["join", " ", ["array", "Basic", ["base64", ["join", ":", ["array", "$user", "$password"]]]]]},
               {"path": "/body/transferMethodCountry", "value": "$transferMethodCountry", "if_defined": "$transferMethodCountry"},
               {"path": "/body/transferMethodCurrency", "value": "$transferMethodCurrency", "if_defined": "$transferMethodCurrency"},
               {"path": "/body/type", "value": "BANK_CARD"},
               {"path": "/body/cardNumber", "value": "$number"},
               {"path": "/body/dateOfExpiry", "value": ["join","-",["array","$expiration_year","$expiration_month"]]},
               {"path": "/body/cvv", "value": "$cvv_2"}
       ]
   }]  
}
 

  axios.post('https://forwarding.sandbox.braintreegateway.com', data, options)
    .then(function (response) {
      // handle success
      const data = response.data;
      res.send(data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.send(error.response.data);
    });
    
  // btHelper.paymentMetohdCreateFromPaymentMethodToken("kykgpd8f").then((nonceResponse) => {
    
  // const nonce = nonceResponse.paymentMethodNonce.nonce;
  
  // makeForwardApiCall(nonce);



  // }).catch(function (error) {
  //   // handle error
  //   console.log(error);
  //   res.send(error);
  // });
  
});

/*
const makeForwardApiCall = function (nonce) {

  //headers
  const options = {
    auth: {
      username: process.env.BT_PUBLIC_KEY,
      password: process.env.BT_PRIVATE_KEY
    }
  };

  //payload to the target API
  hwUserToken ="usr-945b1789-30a4-4e6a-9fa8-b1ed87c80787";

  data = {
    merchant_id: process.env.BT_MERCHANT_ID,
    payment_method_nonce: nonce,   //braintree_payment_method_token,
    sensitive_data: {
        user: process.env.Hyperwallet_username,
        password: process.env.hyperwallet_password,
    },
    data:{
        transferMethodCountry: "GB",
        transferMethodCurrency: "GBP",
    },
    url: `https://uat-api.paylution.com/rest/v4/users/${hwUserToken}/bank-cards/`,
    method: "POST",
    configs: [{
       name: "progressplay_sb_hyperwallet_bankcards",
       methods: ["POST", "PUT"],
       url: "^https:\/\/uat-api.paylution.com\/rest\/v4\/users\/.*\/bank-cards\/.*$",
       request_format: {"/body": "json"},
       types: ["CreditCard"],
       transformations: [
               {"path": "/header/Authorization",
                   "value": ["join", " ", ["array", "Basic", ["base64", ["join", ":", ["array", "$user", "$password"]]]]]},
               {"path": "/body/transferMethodCountry", "value": "$transferMethodCountry", "if_defined": "$transferMethodCountry"},
               {"path": "/body/transferMethodCurrency", "value": "$transferMethodCurrency", "if_defined": "$transferMethodCurrency"},
               {"path": "/body/type", "value": "BANK_CARD"},
               {"path": "/body/cardNumber", "value": "$number"},
               {"path": "/body/dateOfExpiry", "value": ["join","-",["array","$expiration_year","$expiration_month"]]},
               {"path": "/body/cvv", "value": "$cvv"}
       ]
   }]  
}
 

  axios.post('https://forwarding.sandbox.braintreegateway.com', data, options)
    .then(function (response) {
      // handle success
      const data = response.data;
      res.send(data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.send(error.response.data);
    });

}
*/
module.exports = router;
