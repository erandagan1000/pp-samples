const express = require('express');
const router = express.Router();
const ppApiHelperV1 = require('../helpers/ppApiHelperV1')

// test
router.get('/', (req, res, next) => {
  // res.status(200).send("works");
  res.status(200).send(ppApiHelperV1.test());

}, (error, result) => {
  if (result) {
    res.send(result);
  } else {
    res.status(500).send(error);
  }
});

// generate "access token" from PP REST API, givven merchant credenials. 
// the "access token" will be used by client request (Authorization header "Bearer") to generate 
// a client_token, client_token is the tokne used to execute the methods in PP SDK and should be created a new one 
// for each payment transaction 
router.post('/accesstoken/generate', (req, res, next) => {

  try {
    ppApiHelperV1.generateAccessToken((data, error) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      data.merchantName = process.env.PP_MERCHANT_NAME
      res.status(200).send(data);
      return;

    });


  }
  catch (error) {
    // handle error
    console.log(error);
    res.status(500).send(error);
  }


});

// generate client_token
router.post('/clienttoken/generate', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  ppApiHelperV1.generateClientToken(accessToken, undefined, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

// generate client_token
router.post('/clienttoken/generate/customerid', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const payload= req.body;
  const customerId = payload.customer_id;
  ppApiHelperV1.generateClientTokenWithCustomerId(accessToken, customerId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

// generate client_token with billing-agreement
router.post('/clienttoken/generate/baid', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const baId = req.body.baId; // RT
  const customerId =req.body.customerId
  ppApiHelperV1.generateClientTokenWithBillingAgreementId(accessToken,baId,customerId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});


module.exports = router;