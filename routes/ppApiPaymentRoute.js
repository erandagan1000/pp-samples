// This backend code will be used when merchant wants to use 
// the AS2 (Authorize/Capture) or AS1 (Order/authorize/Capture) pp settlements model. 
// full details here: https://developer.paypal.com/docs/archive/payments/orders/
// Use the Payments REST API to create a PayPal order, which is a purchase that a customer 
// consents to but for which funds are not placed on hold.
// typical to merchants that sell physical goods - so they need to check inventory and ship before they charge the customer

const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppApiHelperV2 = require('../helpers/ppApiHelperV2')
const ppApiHelperV1 = require('../helpers/ppApiHelperV1')



router.post('/create', (req, res, next) => {

  let payload = req.body;
  let body = {
    ...payload, redirect_urls:
    {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    }
  }
  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV1.createPayment(guid, body, (data, error) => {
    if (error) {
      res.status(500).send(error);
      console.log(error.response.data.details)
      return;
    }
    let token;

    for (let link of data.links) {
      if (link.rel === 'approval_url') {
        token = link.href.match(/EC-\w+/)[0];
      }
    }
    res.status(200).send({token, paymentId: data.id, links: data.links});
    return;
  });

});

router.patch('/update', (req, res, next) => {

  const payload = req.body;

  ppApiHelperV1.onShippingChange(payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    console.log("SUCCESS");
    res.status(200).send(data);
    return;

  });
});

router.post('/execute-payment', (req, res, next) => {
  var paymentId = req.body.paymentId;
  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV1.executePayment(guid, paymentId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;
  });

});

router.get('/userinfo', (req, res, next) => {
  
  ppApiHelperV1.getUserInfo((data, error) => {
    if (error) {
      res.status(500).send(error);
      console.log(error.response.data.details)
      return;
    }
    
    res.status(200).send(data);
    return;
  });
  
});

router.get('/:paymentid', (req, res, next) => {
  var paymentID = req.params.paymentid;
  const guid = ppApiHelperV2.uuidv4();
  ppApiHelperV1.getPayment(guid, paymentID, (data, error) => {
    if (error) {
      res.status(500).send(error);
      console.log(error.response.data.details)
      return;
    }
    
    res.status(200).send(data);
    return;
  });
  
});

module.exports = router;