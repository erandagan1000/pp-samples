// merchant: eran.m.us@merchant.com

// https://developer.paypal.com/api/nvp-soap/NVPAPIOverview/
var globalRepo = {
  token: '',
  amount: '',
  payerId: '',
  baId: ''
}
const axios = require('axios').default;

const ppAppIL = {
  identifier: "ppapp_il",
  user: "sb-nbbv29187947_api1.business.example.com",
  password: "KWJRWRSEX3M9DL6W",
  signature: "A0sMXJquGaU-ojwm1INM52vCoHK4AIg5NtbvVE-JirehO8lSB9e.kuQg"
}

const ppAppUS = {
  identifier: "ppapp_us",
  user: "sb-fdhqv12110699_api1.business.example.com",
  password: "LVLCW8JQRMTKAWVV",
  signature: "AZtvKKDvwCy2IviJ1ypzYiZgRHF6AImT1rcDNCvAixiDa-iA2chJsAVB"
}

var nvpConfig = ppAppIL;

const test = () => {
  return "hello test"
}

// #region Checkout Functions
const setExpressCheckout = (data, callback) => {
  const amount = "212.00";
  globalRepo.amount = amount;

  const config = {
    headers: {}
  };
  if (!data) {
    data = "METHOD=SetExpressCheckout" +
      "&VERSION=50.0" +
      "&USER=" + nvpConfig.user +
      "&PWD=" +nvpConfig.password +
      "&SIGNATURE=" + nvpConfig.signature +
      "&AMT=" + amount +
      "&PAYMENTREQUEST_0_INVNUM="+nvpConfig.identifier+"_1234"  +
      "&cancelUrl=http://localhost:3000/ppnvpicc/cancel" +
      "&returnUrl=http://localhost:3000/ppnvpicc/success";


  }

  // NVP setExpressCheckout 
  axios.post('https://api-3t.sandbox.paypal.com/nvp', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })

}

const setupBillingAgreementWithPayment = (data, callback) => {

  const amount = "765.00";
  globalRepo.amount = amount;
  const config = {
    headers: {}
  };
  if (!data) {
    data = "METHOD=SetExpressCheckout" +
      "&VERSION=86" +
      "&USER=" + nvpConfig.user +
      "&PWD=" +nvpConfig.password +
      "&SIGNATURE=" + nvpConfig.signature +
      "&PAYMENTREQUEST_0_PAYMENTACTION=AUTHORIZATION" +  // #Payment authorization
      "&PAYMENTREQUEST_0_AMT=" + amount + // #The amount authorized
      "&PAYMENTREQUEST_0_CURRENCYCODE=USD" + //#The currency, e.g. US dollars
      "&L_BILLINGTYPE0=MerchantInitiatedBilling" + // #The type of billing agreement
      "&L_BILLINGAGREEMENTCUSTOM0=" + nvpConfig.identifier + "_5678" +
      "&L_BILLINGAGREEMENTDESCRIPTION0=This is the description of the Billing Agreement " + // #The description of the billing agreement
      "&cancelUrl=http://localhost:3000/ppnvpicc/cancel" + // #For use if the consumer decides not to proceed with payment
      "&returnUrl=http://localhost:3000/ppnvpicc/success?rt=1"; // #For use if the consumer proceeds with payment


  }

  // NVP setExpressCheckout 
  axios.post('https://api-3t.sandbox.paypal.com/nvp', data, config)
    .then(function (response) {
      // handle success
      const data = response.data; // e.g. TOKEN=EC%2d55H14620BG412110F&TIMESTAMP=2022%2d03%2d15T11%3a33%3a34Z&CORRELATIONID=e60af05e23c2d&ACK=Success&VERSION=86&BUILD=56144363
      
      console.log(data);
      const arr = data.split('&');
      const token = arr[0].split('=')[1];
      globalRepo.token = token;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })

}

const setupBillingAgreementBeforePayment = (data, callback) => {
  // amount = 0 , no charge yet
  const config = {
    headers: {}
  };
  if (!data) {
    data = "METHOD=SetExpressCheckout" +
      "&VERSION=86" +
      "&USER=" + nvpConfig.user +
      "&PWD=" +nvpConfig.password +
      "&SIGNATURE=" + nvpConfig.signature +
      "&PAYMENTREQUEST_0_PAYMENTACTION=AUTHORIZATION" +  // #Payment authorization
      "&PAYMENTREQUEST_0_AMT=00.00" + // #The amount authorized // 00.00 doesnt work anymore apr-2023
      "&PAYMENTREQUEST_0_CURRENCYCODE=USD" + //#The currency, e.g. US dollars
      "&L_BILLINGTYPE0=MerchantInitiatedBilling" + // #The type of billing agreement
      "&L_BILLINGAGREEMENTDESCRIPTION0=This is the description of the Billing Agreement" + // #The description of the billing agreement
      "&cancelUrl=http://localhost:3000/ppnvpicc/cancel" + // #For use if the consumer decides not to proceed with payment
      "&returnUrl=http://localhost:3000/ppnvpicc/success?rt=1"; // #For use if the consumer proceeds with payment



  }

  // NVP setExpressCheckout 
  axios.post('https://api-3t.sandbox.paypal.com/nvp', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })

}

const createBillingAgreement = (token, payerId, callback) => {
  console.log(globalRepo);
  var amount = globalRepo.amount || 0; 
  const config = {
    headers: {}
  };

  data = "METHOD=CreateBillingAgreement" +
    "&VERSION=86" +
    "&USER=" + nvpConfig.user +
    "&PWD=" +nvpConfig.password +
    "&SIGNATURE=" + nvpConfig.signature +
    "&AMT=" + amount +
    "&TOKEN=" + token;

  // NVP setExpressCheckout 
  axios.post('https://api-3t.sandbox.paypal.com/nvp', data, config)
    .then(function (response) {
      // handle success
      const baResult = response.data; // e.g. data = BILLINGAGREEMENTID=B%2d7FB31251F28061234&ACK=Success
     
      console.log(globalRepo);
      console.log(baResult);
      if(payerId) {
        capturePurchase(token, payerId, globalRepo.amount, callback);
      }
      else{
        
      const arr = baResult.split("&");
      const responseData = {data: arr};
        callback(responseData);
      }
      

    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })

}

const capturePurchase = (token, payerId, amount, callback) => {
  console.log(globalRepo);
  if(amount == 0 || !amount) { amount = globalRepo.amount};
  const config = {
    headers: {}
  };

  data = "METHOD=DoExpressCheckoutPayment" +
    "&VERSION=86" +
    "&USER=" + nvpConfig.user +
    "&PWD=" +nvpConfig.password +
    "&SIGNATURE=" + nvpConfig.signature +
    "&TOKEN=" + token +
    "&PAYMENTREQUEST_0_PAYMENTACTION=SALE" +
    "&PAYERID=" + payerId +
    "&PAYMENTREQUEST_0_AMT=" + amount



  // NVP setExpressCheckout 
  axios.post('https://api-3t.sandbox.paypal.com/nvp', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      const arr = data.split("&");
      const responseData = {data: arr};
      
      callback(responseData, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })

}

// #endregion

module.exports = {
  test,
  setExpressCheckout,
  setupBillingAgreementWithPayment,
  setupBillingAgreementBeforePayment,
  createBillingAgreement,
  capturePurchase


};