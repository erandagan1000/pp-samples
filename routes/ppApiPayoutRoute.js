
const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const ppApiHelperV1 = require('../helpers/ppApiHelperV1')

// create order
router.post('/', (req, res, next) => {
  const token = req.headers["authorization"]
  ppApiHelperV1.createPayout(token, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});



module.exports = router;