var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayPal Demo' });
});
router.get('/lr', function(req, res, next) {
  res.render('limitedRelease', { title: 'Limited Release URLs' });
});

// ********************  Braintree ************************
// #region BRAINTREE
router.get('/btco', function(req, res, next) {
  res.render('braintreePPCheckout', { title: 'BrainTree Paypal Checkout + Auth/Capture' });
});
router.get('/btco1', function(req, res, next) {
  res.render('braintreePPCheckout1', { title: 'BrainTree Paypal Checkout + Auth/Capture V2' });
});
router.get('/btco2', function(req, res, next) {
  res.render('braintreePPCheckoutLoadScriptInScriptTag', { title: 'BrainTree Paypal Checkout + Auth/Capture - With Config' });
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
router.get('/btdihf', function(req, res, next) {
  res.render('braintreeDropinAndHostedFields', { title: 'BrainTree Dropin + Hosted Fields' });
});
router.get('/bthfcvvon', function(req, res, next) {
  res.render('braintreeHostedFieldsCvvOnlyNonce', { title: 'BrainTree Hosted Fields CVV-Only Nonce' });
});
router.get('/bt3ds', function(req, res, next) {
  res.render('braintree3DS', { title: 'BrainTree Dropin + Hosted Fields (3DS)' });
});
router.get('/btvenmo', function(req, res, next) {
  res.render('braintreeVenmo', { title: 'BrainTree Venmo' });
});
router.get('/btach', function(req, res, next) {
  res.render('braintreeAchDirectDebit', { title: 'BrainTree ACH Direct Debit' });
});
router.get('/btap', function(req, res, next) {
  res.render('braintreeApplePay', { title: 'BrainTree Apple Pay' });
});
router.get('/btgp', function(req, res, next) {
  res.render('braintreeGooglePay', { title: 'BrainTree Google Pay' });
});
router.get('/ppscgnosdk', function(req, res, next) {
  res.render('braintreeCheckoutGraphQLNoClientSdkPP', { title: 'GraphQL PP Standard Checkout - NO Client SDK' });
});

router.get('/ccgnosdk', function(req, res, next) {
  res.render('braintreeCheckoutGraphQLNoClientSdkCC', { title: 'GraphQL Credit Card Checkout - NO Client SDK' });
});

// #endregion

// ********************  PayPal ************************
// #region PAYPAL
router.get('/ppsc', function(req, res, next) {
  res.render('ppsc', { title: 'PP Smart Payment Button - Standard Checkout' });
});
router.get('/ppscmsg', function(req, res, next) {
  res.render('ppscMessaging', { title: 'PP Messaging' });
});

router.get('/ppspbapi', function(req, res, next) {
  res.render('ppSpbAndOrdersApi', { title: 'PP Rest API + SPB - Standard Checkout' });
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
router.get('/ppsabv1', function(req, res, next) {
  res.render('ppStandaloneButtonV1', { title: 'PP Rest API - Standalone Button - Payments V1' });
});
router.get('/ppsabv2', function(req, res, next) {
  res.render('ppStandaloneButtonV2', { title: 'PP Rest API - Standalone Button - Orders V2' });
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
router.get('/pprtrc', function(req, res, next) {
  res.render('ppRTReturningCustomer', { title: 'PP Rest API - Returning Customer' });
});
router.get('/ppvenmo', function(req, res, next) {
  res.render('ppVenmo', { title: 'PP Rest API - Venmo' });
});
router.get('/ppapmov2', function(req, res, next) {
  res.render('ppAlternatePaymentMethodsOrdersV2', { title: 'PP Rest API - APM - Orders V2' });
});
router.get('/ppapmjssdk', function(req, res, next) {
  res.render('ppAlternatePaymentMethodsJSSDK', { title: 'PP Rest API - APM - JSSDK' });
});


router.get('/ppsub', function(req, res, next) {
  res.render('ppSubscription', { title: 'PP Subscription' });
});

router.get('/ppvault', function(req, res, next) {
  res.render('ppVault', { title: 'PP Vault - Limited release' });
}); 

// router.get('/ppvaultv3', function(req, res, next) {
//   res.render('ppVaultV3', { title: 'PP Vault V3 - Limited release' });
// });

router.get('/ppvaultv3pp', function(req, res, next) {
  res.render('ppvaultv3pp', { title: 'PP Vault V3 - PayPal' });
});

router.get('/ppvaultv3card', function(req, res, next) {
  res.render('ppvaultv3card', { title: 'PP Vault V3 - Credit Card', clientId: process.env.PP_API_CLIENT_ID });
});

router.get('/ppvaultv3venmo', function(req, res, next) {
  res.render('ppvaultv3venmo', { title: 'PP Vault V3 - Venmo' });
});

router.get('/ppvaultv3apay', function(req, res, next) {
  res.render('ppvaultv3apay', { title: 'PP Vault V3 - Apple Pay' });
});

// #endregion

// ********************  PayPal NVP ************************
// #region PayPal NVP 


router.get('/ppnvpicc', function(req, res, next) {
  res.render('ppNvpInContextCheckout', { title: 'PP NVP In Context Checkout' });
});
router.get('/ppnvprt', function(req, res, next) {
  res.render('ppNvpRT', { title: 'PP NVP Reference Transaction Checkout Before Purchase' });
});
router.get('/ppnvprtco', function(req, res, next) {
  res.render('ppNvpCheckoutRT', { title: 'PP NVP Reference Transaction Checkout During Purchase' });
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
