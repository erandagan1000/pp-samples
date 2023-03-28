const braintree = require("braintree");

// In server side
// if using the ECBT integration, merchant will typically use:  btConfigEcbtUS or btConfigEcbtUK (no BT console access)
// if using full BT integration, merchant will typically use btConfig (full access to BT console)
//ECBT - eran.m.us@merchant.com
const btConfigEcbtUS = {
  // accessToken: "access_token$sandbox$x466p4f9j62pxtdb$741d28605865c973da8116f68a6f2a36"
  accessToken: "access_token$sandbox$dc95jmkxp82n6wxj$eec6c23d7ae7a481677df772631d4aa4"
  // accessToken: "access_token$sandbox$w8w347gckb2936t4$0924afe9f0493a58fcc9b6c57a0a49f9"  //karins token
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
    switch (currency) {
      case "EUR":
        return "eranltd_EUR";
        case "GBP":
          return "eranltd_GBP";
        default:
          return merchantAccountId;
    }
    
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

const paymentMetohdCreateFromPaymentMethodToken = function (pmToken) {
   
  return gateway.paymentMethod.create(pmToken);
}

const addressCreate = function (address) {
   
  return gateway.address.create(address);
}

const submitForSettlement = function (transactionId) {
   
  return gateway.transaction.submitForSettlement(transactionId);
}

const find = function (transactionId) {
   
  return gateway.transaction.find(transactionId);
}

const gateway = new braintree.BraintreeGateway(btConfig);
const isECBT = true;

module.exports = {
  isECBT,
  gateway,
  getMerchantAccountIdByCurrency,
  getCustomerById,
  creditCardCreate,
  customerCreate,
  paymentMetohdCreate,
  addressCreate,
  submitForSettlement,
  find,
  paymentMetohdCreateFromPaymentMethodToken


};