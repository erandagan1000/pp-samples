const express = require('express');
const router = express.Router();
const ppNvpApiHelper = require('../helpers/ppNvpApiHelper');

// set express checkout
router.post('/ec', (req, res, next) => {

  const data = undefined // req.body;
  ppNvpApiHelper.setExpressCheckout(data ,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

router.post('/doec', (req, res, next) => {

  const payload = req.body;
  var amount = 0 ;
  ppNvpApiHelper.capturePurchase(payload.token, payload.payerId, amount ,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});



// setup BillAgree. before payment
router.post('/rt', (req, res, next) => {

  const data = undefined // req.body;
  ppNvpApiHelper.setupBillingAgreementBeforePayment(data ,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// setup BillAgree. with payment
router.post('/rtco', (req, res, next) => {

  const data = undefined // req.body;
  ppNvpApiHelper.setupBillingAgreementWithPayment(data ,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// create BillAgree. with given token and payerID
router.post('/rt/ba', (req, res, next) => {

  const token = req.body.token;
  const payerId = req.body.payerId
  ppNvpApiHelper.createBillingAgreement(token, payerId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    } 
    res.status(200).send(data);
    return;

  });
});


module.exports = router;