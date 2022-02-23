var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/btcheckout', function(req, res, next) {
  res.render('braintreePPCheckout', { title: 'BrainTree Paypal Checkout' });
});
router.get('/btvault', function(req, res, next) {
  res.render('braintreeVault', { title: 'BrainTree Paypal Vault' });
});
router.get('/btvaultdatacollector', function(req, res, next) {
  res.render('braintreeVaultWithDataCollector', { title: 'BrainTree Paypal Vault With Data Collector' });
});
router.get('/btvaultreturncustomer', function(req, res, next) {
  res.render('braintreePPVaultReturnungCustomer', { title: 'BrainTree Paypal Vault Returning Customer' });
});

router.get('/bt', function(req, res, next) {
  res.render('braintree', { title: 'BrainTree Dropin + Hosted Fields' });
});
router.get('/ppsc', function(req, res, next) {
  res.render('ppsc', { title: 'PP Rest API - Standard Checkout' });
});
router.get('/ppccs', function(req, res, next) {
  res.render('ppccShip', { title: 'PP Rest API - Custom Checkout With Shipping Options' });
});
router.get('/ppccm', function(req, res, next) {
  res.render('ppccMarks', { title: 'PP Rest API - Custom Checkout Other Payment Methods' });
});
router.get('/ppac', function(req, res, next) {
  res.render('ppac', { title: 'PP Rest API - Advanced Checkout' });
});
router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Transaction completed' });
});
module.exports = router;
