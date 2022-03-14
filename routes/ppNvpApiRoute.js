
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppNvpApiHelper = require('../helpers/ppNvpApiHelper');

// create order
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


module.exports = router;