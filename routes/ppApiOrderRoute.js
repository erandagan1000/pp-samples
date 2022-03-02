
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppApiHelperV2 = require('../helpers/ppApiHelperV2')

// create order
router.post('/', (req, res, next) => {

  ppApiHelperV2.createOrder((data, error) => {
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
  ppApiHelperV2.captureOrder(orderId,(data, error) => {
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
  ppApiHelperV2.captureOrder(orderId,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

module.exports = router;