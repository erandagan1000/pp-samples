
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
      return_url: 'https://example.com',
      cancel_url: 'https://example.com'
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