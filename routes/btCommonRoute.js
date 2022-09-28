
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

router.get('/address/create/:customerid', (req, res, next) => {

  const customerId = req.params.customerid;
  const address = {
    customerId,
    firstName: "Jenna",
    lastName: "Smith",
    company: "Braintree",
    streetAddress: "1 E Main St",
    extendedAddress: "Suite 403",
    locality: "Chicago",
    region: "Illinois",
    postalCode: "60607",
    countryCodeAlpha2: "US"
  };
  btHelper.addressCreate(address).then(function (addResponse) {


    res.status(200).send(addResponse);
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

router.post('/vault/customer', (req, res, next) => {

  const nonce = req.body.paymentMethodNonce;
  var customer = {
    firstName: "Jen",
    lastName: "Smith",
    company: "Braintree",
    email: "jen@example.com",
    phone: "312.555.1234",
    fax: "614.555.5678",
    website: "www.example.com"
  };
  btHelper.customerCreate(customer).then(function (savedCustomer) {

    console.log(savedCustomer);
    btHelper.paymentMetohdCreate({
      customerId: savedCustomer.customer.id,
      paymentMethodNonce: nonce
    }).then(function (savedPaymentMethod) {
      res.status(200).send(savedPaymentMethod);

    }).catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });
  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });

});

module.exports = router;