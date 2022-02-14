const braintree = require("braintree");
//braintree sandbox account under eran.dagan1@gmail.com
//https://sandbox.braintreegateway.com/login
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "8n5hz5rwnb656jks",
  publicKey: "y7254zqncx2hnm52",
  privateKey: "26303b7ff60ab3ebe401e22b172d972e",
});

module.exports = gateway;