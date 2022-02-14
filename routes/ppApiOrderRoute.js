
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppApiHelper = require('../helpers/ppApiHelper')

// create order
router.post('/', (req, res, next) => {

  ppApiHelper.createOrder((data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// capture order
router.post('/:id/capture', (req, res, next) => {

  orderId = req.params.id;
  ppApiHelper.captureOrder(orderId,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

router.post('/capture', (req, res, next) => {

  orderId = req.body.orderId;
  ppApiHelper.captureOrder(orderId,(data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});
module.exports = router;