// merchant: eran.m.us@merchant.com

// https://developer.paypal.com/api/nvp-soap/NVPAPIOverview/
var globalRepo = {
  token: '',
  amount: '',
  payerId: '',
  baId: ''
}
const axios = require('axios').default;


const test = () => {
  return "hello test"
}

// #region Checkout Functions
const setExpressCheckout = (data, callback) => {

  const config = {
    headers: {}
  };
  if (!data) {
    data = "METHOD=SetExpressCheckout" +
      "&VERSION=124.0" +
      "&USER=sb-fdhqv12110699_api1.business.example.com" +
      "&PWD=LVLCW8JQRMTKAWVV" +
      "&SIGNATURE=AZtvKKDvwCy2IviJ1ypzYiZgRHF6AImT1rcDNCvAixiDa-iA2chJsAVB" +
      "&AMT=33" +
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

  const amount = "13.00";
  globalRepo.amount = amount;
  const config = {
    headers: {}
  };
  if (!data) {
    data = "METHOD=SetExpressCheckout" +
      "&VERSION=86" +
      "&USER=sb-fdhqv12110699_api1.business.example.com" +
      "&PWD=LVLCW8JQRMTKAWVV" +
      "&SIGNATURE=AZtvKKDvwCy2IviJ1ypzYiZgRHF6AImT1rcDNCvAixiDa-iA2chJsAVB" +
      "&PAYMENTREQUEST_0_PAYMENTACTION=AUTHORIZATION" +  // #Payment authorization
      "&PAYMENTREQUEST_0_AMT=" + amount + // #The amount authorized
      "&PAYMENTREQUEST_0_CURRENCYCODE=USD" + //#The currency, e.g. US dollars
      "&L_BILLINGTYPE0=MerchantInitiatedBilling" + // #The type of billing agreement
      "&L_BILLINGAGREEMENTDESCRIPTION0=ClubUsage" + // #The description of the billing agreement
      "&cancelUrl=http://localhost:3000/ppnvpicc/cancel" + // #For use if the consumer decides not to proceed with payment
      "&returnUrl=http://localhost:3000/ppnvpicc/success"; // #For use if the consumer proceeds with payment


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

  const config = {
    headers: {}
  };
  if (!data) {
    data = "METHOD=SetExpressCheckout" +
      "&VERSION=86" +
      "&USER=sb-fdhqv12110699_api1.business.example.com" +
      "&PWD=LVLCW8JQRMTKAWVV" +
      "&SIGNATURE=AZtvKKDvwCy2IviJ1ypzYiZgRHF6AImT1rcDNCvAixiDa-iA2chJsAVB" +
      "&PAYMENTREQUEST_0_PAYMENTACTION=AUTHORIZATION" +  // #Payment authorization
      "&PAYMENTREQUEST_0_AMT=25.00" + // #The amount authorized
      "&PAYMENTREQUEST_0_CURRENCYCODE=USD" + //#The currency, e.g. US dollars
      "&L_BILLINGTYPE0=MerchantInitiatedBilling" + // #The type of billing agreement
      "&L_BILLINGAGREEMENTDESCRIPTION0=ClubUsage" + // #The description of the billing agreement
      "&cancelUrl=http://localhost:3000/ppnvpicc/cancel" + // #For use if the consumer decides not to proceed with payment
      "&returnUrl=http://localhost:3000/ppnvpicc/success"; // #For use if the consumer proceeds with payment



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

  const config = {
    headers: {}
  };

  data = "METHOD=CreateBillingAgreement" +
    "&VERSION=86" +
    "&USER=sb-fdhqv12110699_api1.business.example.com" +
    "&PWD=LVLCW8JQRMTKAWVV" +
    "&SIGNATURE=AZtvKKDvwCy2IviJ1ypzYiZgRHF6AImT1rcDNCvAixiDa-iA2chJsAVB" +
    "&TOKEN=" + token;





  // NVP setExpressCheckout 
  axios.post('https://api-3t.sandbox.paypal.com/nvp', data, config)
    .then(function (response) {
      // handle success
      const data = response.data; // e.g. data = BILLINGAGREEMENTID=B%2d7FB31251F28061234&ACK=Success
      const arr = data.split('&');
      // const baId = arr[0].split('=')[1];
      console.log(globalRepo);
      capturePurchase(token, payerId, globalRepo.amount, callback);

    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })

}

const capturePurchase = (token, payerId, amount, callback) => {
  console.log(globalRepo);
  const config = {
    headers: {}
  };

  data = "METHOD=DoExpressCheckoutPayment" +
    "&VERSION=86" +
    "&USER=sb-fdhqv12110699_api1.business.example.com" +
    "&PWD=LVLCW8JQRMTKAWVV" +
    "&SIGNATURE=AZtvKKDvwCy2IviJ1ypzYiZgRHF6AImT1rcDNCvAixiDa-iA2chJsAVB" +
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
  createBillingAgreement


};