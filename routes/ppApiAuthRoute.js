const express = require('express');
const router = express.Router();
const ppApiHelperV1 = require('../helpers/ppApiHelperV1')

// - /ppapi/auth

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
      data.clientId = process.env.PP_API_CLIENT_ID
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
router.post('/clienttoken/generate/baid', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const baId = req.body.baId; // RT

  ppApiHelperV1.generateClientTokenWithBillingAgreementId(accessToken, baId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

// generate client_token with billing-agreement
router.post('/clienttoken/generate/customerid', (req, res, next) => {

  const accessToken = req.headers["authorization"];

  const customerId = req.body.customer_id && req.body.customer_id.length > 0 ? req.body.customer_id : "uwmkKoRoWs";  // uwmkKoRoWs  is existing customerId in merchant app: ACDC (eran.m.us@merchant.com
  ppApiHelperV1.generateClientTokenWithCustomerId(accessToken, customerId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.get('/ppclientid', (req, res, next) => {

  try {
    let clientId = process.env.PP_API_CLIENT_ID;
    res.status(200).send({clientId});
    return;
  }
  catch (e) {
    res.status(500).send(e);
    return;

  }


});


module.exports = router;