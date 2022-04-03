var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/btco', function(req, res, next) {
  res.render('braintreePPCheckout', { title: 'BrainTree Paypal Checkout' });
});
router.get('/btcov', function(req, res, next) {
  res.render('braintreePPCheckoutVault', { title: 'BrainTree Paypal Checkout Vault' });
});
router.get('/btv', function(req, res, next) {
  res.render('braintreePPVault', { title: 'BrainTree Paypal Vault' });
});
router.get('/btvdc', function(req, res, next) {
  res.render('braintreePPVaultWithDataCollector', { title: 'BrainTree Paypal Vault With Data Collector' });
});
router.get('/btvrc', function(req, res, next) {
  res.render('braintreePPVaultReturningCustomer', { title: 'BrainTree Paypal Vault Returning Customer' });
});
router.get('/btlpm', function(req, res, next) {
  res.render('braintreeLocalPaymentMethods', { title: 'BrainTree Local Payment Methods' });
});
router.get('/bt', function(req, res, next) {
  res.render('braintree', { title: 'BrainTree Dropin + Hosted Fields' });
});
router.get('/btvenmo', function(req, res, next) {
  res.render('braintreeVenmo', { title: 'BrainTree Venmo' });
});
router.get('/btach', function(req, res, next) {
  res.render('braintreeAchDirectDebit', { title: 'BrainTree ACH Direct Debit' });
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
router.get('/ppacdls', function(req, res, next) {
  res.render('ppacLoadSdkOnRuntime', { title: 'PP Rest API - Advanced Checkout - Load Client SDK on runtime' });
});

router.get('/ppac3ds', function(req, res, next) {
  res.render('ppac3ds', { title: 'PP Rest API - 3D Secure' });
});
router.get('/ppcort', function(req, res, next) {
  res.render('ppcoRT', { title: 'PP Rest API - Advanced Checkout With RT',ec_token: req.query.token, ba_token: req.query.ba_token  });
});
router.get('/pprt', function(req, res, next) {
  res.render('pprt', { title: 'PP Rest API - Reference Transaction' });
});
router.get('/ppvenmo', function(req, res, next) {
  res.render('ppVenmo', { title: 'PP Rest API - Venmo' });
});
router.get('/ppapm', function(req, res, next) {
  res.render('ppAlternatePaymentMethods', { title: 'PP Rest API - AOM - Alternate Payment Methods' });
});

router.get('/ppsub', function(req, res, next) {
  res.render('ppSubscription', { title: 'PP Subscription' });
});
router.get('/ppnvpicc', function(req, res, next) {
  res.render('ppNvpInContextCheckout', { title: 'PP NVP In Context Checkout' });
});
router.get('/ppnvprt', function(req, res, next) {
  res.render('ppNvpRT', { title: 'PP NVP Reference Transaction Checkout Before Purchase' });
});
router.get('/ppnvprtco', function(req, res, next) {
  res.render('ppNvpCheckoutRT', { title: 'PP NVP Reference Transaction Checkout During Purchase' });
});

// result pages
router.get('/ppnvpicc/success', function(req, res, next) {
  res.render('success', { title: 'NVP Transaction success', token: req.query.token, payer: req.query.PayerID  });
});

router.get('/ppnvpicc/cancel', function(req, res, next) {
  res.render('success', { title: 'NVP Transaction cancelled', token: req.query.token });
});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Transaction Succeeded' });
});

router.get('/cancel', function(req, res, next) {
  res.render('cancel', { title: 'Transaction Cancelled' });
});
module.exports = router;
