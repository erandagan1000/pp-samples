const braintree = require("braintree");

// In server side
// if using the ECBT integration, merchant will typically use:  btConfigEcbtUS or btConfigEcbtUK (no BT launchpad access)
// if using full BT integration, merchant will typically use btConfig (full access to BT launchpad)
//ECBT - eran.m.us@merchant.com
const btConfigEcbtUS = {
  accessToken: "access_token$sandbox$hq7c8r82tfvt3yqw$f2468ab77bd83587c48979083f4ac57e"
}

//ECBT - eran.m.uk@merchant.com
const btConfigEcbtUK = {
  accessToken: "access_token$sandbox$dc95jmkxp82n6wxj$eec6c23d7ae7a481677df772631d4aa4"
}

// BT full Integration
const btConfig = {
  environment: braintree.Environment.Sandbox,
  merchantId: "8n5hz5rwnb656jks",
  publicKey: "y7254zqncx2hnm52",
  privateKey: "26303b7ff60ab3ebe401e22b172d972e",
}

//braintree sandbox account under eran.dagan1@gmail.com
//https://sandbox.braintreegateway.com/login

// const btConfig = {
//   environment: braintree.Environment.Sandbox,
//   merchantId:  process.env.BT_MERCHANT_ID, // "8n5hz5rwnb656jks",
//   publicKey: process.env.BT_PUBLIC_KEY, // "y7254zqncx2hnm52",
//   privateKey: process.env.BT_PRIVSTE_KEY // "26303b7ff60ab3ebe401e22b172d972e",
// };

const getMerchantAccountIdByCurrency = function (currency) {
  let merchantAccountId =  "eranltd";
  if(currency){
    merchantAccountId = currency == 'EUR' ? "eranltd_EUR" : "eranltd"; 
  } 
  return merchantAccountId;
}

const getCustomerById = function (customerId) {
   
  return gateway.customer.find(customerId);
}

const creditCardCreate = function (creditCardParams) {
   
  return gateway.creditCard.create(creditCardParams);
}

const customerCreate = function (customer) {
   
  return gateway.customer.create(customer);
}

const paymentMetohdCreate = function (pmMethoParams) {
   
  return gateway.paymentMethod.create(pmMethoParams);
}


const gateway = new braintree.BraintreeGateway(btConfig);

module.exports = {
  gateway,
  getMerchantAccountIdByCurrency,
  getCustomerById,
  creditCardCreate,
  customerCreate,
  paymentMetohdCreate


};