
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppApiHelperV2 = require('../helpers/ppApiHelperV2')

// route: /ppapi/order

router.post('/', (req, res, next) => {

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "2005.00"
        }
      }
    ]
  };
  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV2.createOrder(guid, payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

router.post('/lpm/sofort', (req, res, next) => {

  const guid = ppApiHelperV2.uuidv4();
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: guid,
        amount: {
          currency_code: "GBP",
          value: "102.00"
        }
      }
    ],
    payment_source: {
      sofort: {
        country_code: "GB",
        name: "John Doe",
        email: "john.doe@example.com"
      }
    },
    processing_instruction: "ORDER_COMPLETE_ON_PAYMENT_APPROVAL",
    application_context: {
      locale: "en-GB",
      return_url: "https://0163-147-161-171-4.ngrok.io/lpm/success",
      cancel_url: "https://0163-147-161-171-4.ngrok.io/cancelUrl"
    }
  };

  ppApiHelperV2.createOrder(guid, payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// capture order with orderId in path
router.post('/:id/capture', (req, res, next) => {

  orderId = req.params.id;
  ppApiHelperV2.captureOrder(orderId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// capture order with orderId in body
router.post('/capture', (req, res, next) => {

  orderId = req.body.orderId;
  ppApiHelperV2.captureOrder(orderId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

module.exports = router;