var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayPal Demo' });
});


// ********************  Braintree ************************
// #region BRAINTREE

router.get('/btvenmo', function(req, res, next) {
  res.render('braintreeVenmo', { title: 'BrainTree Venmo' });
});

router.get('/btap', function(req, res, next) {
  res.render('braintreeApplePay', { title: 'BrainTree Apple Pay' });
});
router.get('/btgp', function(req, res, next) {
  res.render('braintreeGooglePay', { title: 'BrainTree Google Pay' });
});


// #endregion

// ********************  PayPal ************************
// #region PAYPAL

router.get('/ppif', function(req, res, next) {
  res.render('ppWithIframe', { title: 'PP Smart Payment Button - Standard Checkout in IFRAME' });
});


router.get('/ppvenmo', function(req, res, next) {
  res.render('ppVenmo', { title: 'PP Rest API - Venmo' });
});


router.get('/ppvaultv3venmo', function(req, res, next) {
  res.render('ppvaultv3venmo', { title: 'PP Vault V3 - Venmo' });
});

router.get('/ppvaultv3apay', function(req, res, next) {
  res.render('ppvaultv3apay', { title: 'PP Vault V3 - Apple Pay' });
});


// #endregion

// ********************  RESULT PAGES ************************
// #region RESULT PAGES
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

router.get('/lpm/success', function(req, res, next) {
  res.render('success', { title: 'LPM Transaction success', token: req.query.token  });
});

// #endregion

module.exports = router;
