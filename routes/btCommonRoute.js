
const express = require('express');
const router = express.Router();
const btHelper = require("../helpers/braintreeHelper");

// base route: /bt

router.get('/customer/:id', (req, res, next) => {
  
  const customerId = req.params.id;
  btHelper.getCustomerById(customerId).then(function (customer) {
    
    
    res.status(200).send(customer);
  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    })

});

router.get('/creditcard/:id', (req, res, next) => {
  
  const customerId = req.params.id;
  let creditCardParams = {
    customerId,
    number: '4111111111111111',
    expirationDate: '06/2024',
    cvv: '100'
  };
  btHelper.creditCardCreate(creditCardParams).then(function (savedCard) {
    
    console.log(savedCard);
    res.status(200).send(savedCard);
  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    })

});

module.exports = router;