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

router.post('/billing-agreement-token/generate', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const data = req.body;
  ppApiHelperV1.generateBillingAgreementToken(accessToken, data, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.post('/billing-agreement', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const data = req.body;  // expecting: {"token_id": "BA-8A802366G0648845Y"}

  ppApiHelperV1.createBillingAgreement(accessToken, data, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.post('/pay', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const data = req.body;  
  /*
  expected payload
  {
  "intent": "sale",
  "payer":
  {
    "payment_method": "PAYPAL",
    "funding_instruments": [
    {
      "billing":
      {
        "billing_agreement_id": "BA-4LA66902307142518"
      }
    }]
  },
  "transactions": [
  {
    "amount":
    {
      "currency": "USD",
      "total": "1.00"
    },
    "description": "Payment transaction.",
    "custom": "Payment custom field.",
    "note_to_payee": "Note to payee field.",
    "invoice_number": "GDAGDS5754YEK",
    "item_list":
    {
      "items": [
      {
        "sku": "skuitemNo1",
        "name": "ItemNo1",
        "description": "The item description.",
        "quantity": "1",
        "price": "1.00",
        "currency": "USD",
        "tax": "0",
        "url": "https://example.com/"
      }]
    }
  }],
  "redirect_urls":
  {
    "return_url": "https://example.com/return",
    "cancel_url": "https://example.com/cancel"
  }
}
  */ 

  ppApiHelperV1.createPayment(accessToken, data, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.post('/billing-agreement', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const billingAgreementId = req.body.baId;  // expecting: {"token_id": "BA-8A802366G0648845Y"}

  ppApiHelperV1.getBillingAgreementDetails(accessToken, billingAgreementId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.post('/billing-agreement-token', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const billingAgreementId = req.body.baId;  // expecting: {"token_id": "BA-8A802366G0648845Y"}

  ppApiHelperV1.createBillingAgreement(accessToken, billingAgreementId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.patch('/billing-agreement', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const billingAgreementId = req.body.baId;
  const modifications = req.body.modifications;  
  
  /*
  expected payload:
  { "baId": xxx,
    "modifications":
    
  [{
  "op": "replace",
  "path": "/",
  "value":
  {
    "description": "Example Billing Agreement",
    "merchant_custom_data": "INV-001"
  }
},
{
  "op": "replace",
  "path": "/plan/merchant_preferences/",
  "value":
  {
    "notify_url": "https://example.com/notification"
  }
 }]
}
  */ 

  ppApiHelperV1.updateBillingAgreementDetails(accessToken, billingAgreementId, modifications, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

router.post('/billing-agreement/cancel', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  const billingAgreementId = req.body.baId;  // expecting: {"baId": "BA-8A802366G0648845Y"}

  ppApiHelperV1.cancelBillingAgreementDetails(accessToken, billingAgreementId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});

module.exports = router;