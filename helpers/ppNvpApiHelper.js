// https://developer.paypal.com/api/nvp-soap/NVPAPIOverview/

const axios = require('axios').default;
const test = () => {
  return "hello test"
}

/*
setExpressCheckout
USER=<xxxxxxxx>
PWD=<xxxxxxx>
SIGNATURE=<xxxxxxxxx>
METHOD=SetExpressCheckout
VERSION=124.0
RETURNURL=https://example.com/return
CANCELURL=https://example.com/cancel
PAYMENTREQUEST_0_PAYMENTACTION=Sale
PAYMENTREQUEST_0_AMT=524.20
PAYMENTREQUEST_0_CURRENCYCODE=USD
PAYMENTREQUEST_0_DESC=test EC payment

https://api-3t.sandbox.paypal.com/nvp \
    --insecure \
    -d METHOD=name \
    -d VERSION=XX.0 \
    -d USER=<var>API-Username</var> \
    -d PWD=<var>API-Password</var> \
    -d SIGNATURE=<var>API-Signature</var> \

*/

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

// #endregion

module.exports = {
  test,
  setExpressCheckout

};