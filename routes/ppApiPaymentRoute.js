// This backend code will be used when merchant wants to use 
// the AS2 (Authorize/Capture) or AS1 (Order/authorize/Capture) pp settlements model. 
// full details here: https://developer.paypal.com/docs/archive/payments/orders/
// Use the Payments REST API to create a PayPal order, which is a purchase that a customer 
// consents to but for which funds are not placed on hold.
// typical to merchants that sell physical goods - so they need to check inventory and ship before they charge the customer

const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();


router.get('/create-payment', (req, res, next) => {

  const payload = req.body;

  const body =
  {
    intent: 'sale',
    payer:
    {
      payment_method: 'paypal'
    },
    transactions: [
      {
        amount:
        {
          total: '5.99',
          currency: 'USD'
        }
      }],
    redirect_urls:
    {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    }
  }

  const options = {
    auth: {
      username: process.env.PP_API_CLIENT_ID,
      password: process.PP_API_CLIENT_SECRET
    }
  };

  axios({
    method: 'post',
    url: 'https://api-m.sandbox.paypal.com/v1/payments/payment',
    data: body,
    options: options
  }).then(function (response) {
    // handle success
    const data = response.data;
    res.status(200).send(data);
  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    })
    .then(function () {
      // always executed
      console.log("second then after error")
    });
});

router.post('/execute-payment', (req, res, next) => {
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;

  const payload = req.body;

  const body = {
    payer_id: payerID,
    transactions: [
      {
        amount:
        {
          total: '10.99',
          currency: 'USD'
        }
      }]
  };

  const options = {
    auth: {
      username: process.env.PP_API_CLIENT_ID,
      password: process.PP_API_CLIENT_SECRET
    }
  };

  axios({
    method: 'post',
    url: `https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentID}/execute`,
    data: body,
    options: options
  }).then(function (response) {
    // handle success
    const data = response.data;
    res.status(200).send(data);
  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    })
    .then(function () {
      // always executed
      console.log("second then after error")
    });

});

module.exports = router;