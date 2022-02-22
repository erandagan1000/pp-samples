const braintree = require("braintree");
//braintree sandbox account under eran.dagan1@gmail.com
//https://sandbox.braintreegateway.com/login

// const btConfig = {
//   environment: braintree.Environment.Sandbox,
//   merchantId:  process.env.BT_MERCHANT_ID, // "8n5hz5rwnb656jks",
//   publicKey: process.env.BT_PUBLIC_KEY, // "y7254zqncx2hnm52",
//   privateKey: process.env.BT_PRIVSTE_KEY // "26303b7ff60ab3ebe401e22b172d972e",
// };

const btConfig = {
  environment: braintree.Environment.Sandbox,
  merchantId: "8n5hz5rwnb656jks",
  publicKey: "y7254zqncx2hnm52",
  privateKey: "26303b7ff60ab3ebe401e22b172d972e",
}

const gateway = new braintree.BraintreeGateway(btConfig);

module.exports = gateway;