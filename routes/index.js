var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/bt', function(req, res, next) {
  res.render('braintree', { title: 'BrainTree' });
});
router.get('/ppsc', function(req, res, next) {
  res.render('ppsc', { title: 'PP API Standard' });
});
router.get('/ppac', function(req, res, next) {
  res.render('ppac', { title: 'PP API Advanced' });
});
router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Transaction completed' });
});
module.exports = router;
