
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppNvpApiHelper = require('../helpers/ppNvpApiHelper');


router.post('/', (req, res, next) => {

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