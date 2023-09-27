
const express = require('express');
const router = express.Router();
const btHelper = require("../helpers/braintreeHelper");
const CircularJSON = require('circular-json');

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

router.get('/capture/:transactionid', (req, res, next) => {

  const transactionId = req.params.transactionid;


  btHelper.submitForSettlement(transactionId).then(function (settledTransaction) {

    console.log(settledTransaction);
    res.status(200).send(settledTransaction);

  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });

});

router.get('/void/:transactionid', (req, res, next) => {

  const transactionId = req.params.transactionid;


  btHelper.voidTransaction(transactionId).then(function (settledTransaction) {

    console.log(settledTransaction);
    res.status(200).send(settledTransaction);

  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });

});


router.get('/transaction/find/:transactionid', (req, res, next) => {

  const transactionId = req.params.transactionid;


  btHelper.find(transactionId).then(function (transaction) {

    console.log(transaction);
    res.status(200).send(transaction);

  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });

});

router.get('/transaction/search/:key/:value', (req, res, next) => {

  const key = req.params.key;
  const value = req.params.value;
  let txns = [];

  btHelper.gateway.transaction.search((search) => {
    search.currency().is("USD");
  }, (err, response) => {
    response.each((err, transaction) => {

      txns.push(transaction);
    });

    setTimeout(() => {
      res.status(200).send(CircularJSON.stringify(txns));
    }, 10000);

  });


});

router.get('/transaction/search/currency', (req, res, next) => {

  let txns =[];

  btHelper.searchByCurrency("USD", (err, response) => {
    response.each((err, transaction) => {
      txns.push(transaction);
    });

    setTimeout(() => {
      res.status(200).send(CircularJSON.stringify(txns));
    }, 10000);

  });

});

router.post('/webhook', (req, res, next) => {

  console.log(req.body);
  res.status(200).send("success");

});



module.exports = router;