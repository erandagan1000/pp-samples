
const express = require('express');
const router = express.Router();
const btHelper = require("../helpers/braintreeHelper");
const graphQl = require('graphql-request')


// base route: /bt/gql
var endpoint = 'https://payments.sandbox.braintree-api.com/graphql';
var returnUrl = "https://braintreegateway.com/successtest";


router.get('/test', (req, res, next) => {

  const accessToken64Bit = btHelper.get64BitApiKey();

  var query = 'query { ping }'
  var variables = {};
  var headers = {
    'Authorization': `Basic ${accessToken64Bit}`,
    'Braintree-Version': '2021-01-18'
  };
  graphQl.request({
    url: endpoint,
    document: query,
    variables: variables,
    requestHeaders: headers,
  }).then(function (data) {
    console.log(data);
    res.status(200).send(data);

  }).catch(function (error) {
    // handle error
    console.log(error);
    res.status(500).send(error);
  })

});

router.post('/create-payment', (req, res, next) => {

  const accessToken64Bit = btHelper.get64BitApiKey();

  var selectedCurrency = req.body.amount.currency_code;
  var amount = req.body.amount.value;
  var merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  var query = graphQl.gql`mutation OneTime($input: CreatePayPalOneTimePaymentInput!) {
    createPayPalOneTimePayment(input: $input) 
    {
      approvalUrl,
      paymentId
      }
    }`
  var variables = {
    "input": {
      "amount": {
        "currencyCode": selectedCurrency,
        "value": amount
      },
      "merchantAccountId": merchantAccountId,
      "cancelUrl": "https://braintreegateway.com/canceltest",
      "intent": "SALE",
      "returnUrl": returnUrl,
      "paypalExperienceProfile": {
        "brandName": "Eran",
        "collectShippingAddress": false,
        "landingPageType": "LOGIN",
        "locale": "en-US"
      }
    }
  };
  var headers = {
    'Authorization': `Basic ${accessToken64Bit}`,
    'Braintree-Version': '2021-01-18'
  };
  graphQl.request({
    url: endpoint,
    document: query,
    variables: variables,
    requestHeaders: headers,
  }).then(function (data) {
    console.log(data);
    res.status(200).send(data);

  }).catch(function (error) {
    // handle error
    console.log(error);
    res.status(500).send(error);
  })

});

router.post('/create-nonce', (req, res, next) => {

  const accessToken64Bit = btHelper.get64BitApiKey();
  var selectedCurrency = req.body.selectedCurrency;
  var merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);
  var paymentToken = req.body.paymentToken;
  var payerId = req.body.payerId;
  var paymentId = req.body.paymentId;

  var query = graphQl.gql`mutation tokenizePayPalOneTimePayment ($tokenizePayPalOneTimePaymentInput: TokenizePayPalOneTimePaymentInput!){
    tokenizePayPalOneTimePayment(input: $tokenizePayPalOneTimePaymentInput)
    {
        clientMutationId
        paymentMethod
        {
            id
            legacyId
        }
    }
}`
  var variables = {
    "tokenizePayPalOneTimePaymentInput": {
        "merchantAccountId": merchantAccountId,
        "paypalOneTimePayment": {
            "paymentToken": paymentToken,
            "payerId": payerId,
            "paymentId": paymentId
        },
        "clientMutationId": "tokenizePayment_0EK45232HK957833W"
    }
};
  var headers = {
    'Authorization': `Basic ${accessToken64Bit}`,
    'Braintree-Version': '2021-01-18'
  };
  graphQl.request({
    url: endpoint,
    document: query,
    variables: variables,
    requestHeaders: headers,
  }).then(function (data) {
    console.log(data);
    res.status(200).send(data);

  }).catch(function (error) {
    // handle error
    console.log(error);
    res.status(500).send(error);
  })

});

router.post('/capture-nonce', (req, res, next) => {

  const accessToken64Bit = btHelper.get64BitApiKey();
  var selectedCurrency = req.body.selectedCurrency;
  var merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);
  var paymentMethodId = req.body.paymentMethodId;
  var amount = req.body.amount;
 

  var query = graphQl.gql`mutation ExampleCharge($input: ChargePaymentMethodInput!) {
    chargePaymentMethod(input: $input) {
      transaction {
        id
        status
        merchantAccountId
      }
    }
  }`
  var variables = {
    "input": {
      "paymentMethodId": paymentMethodId,
      "transaction": {
        "amount": amount,
        "merchantAccountId": merchantAccountId
      }
    }
  };
  var headers = {
    'Authorization': `Basic ${accessToken64Bit}`,
    'Braintree-Version': '2021-01-18'
  };
  graphQl.request({
    url: endpoint,
    document: query,
    variables: variables,
    requestHeaders: headers,
  }).then(function (data) {
    console.log(data);
    res.status(200).send(data);

  }).catch(function (error) {
    // handle error
    console.log(error);
    res.status(500).send(error);
  })

});



module.exports = router;