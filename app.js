var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//pp api
var authRouter = require('./routes/ppApiAuthRoute');
var ppApiPaymentRouter = require('./routes/ppApiPaymentRoute');
var ppApiOrderRouter = require('./routes/ppApiOrderRoute');
var ppApiRtRouter = require('./routes/ppApiReferenceTransactionRoute');
var ppApiPayoutRouter = require('./routes/ppApiPayoutRoute');

//braintree
var btCommonRouter = require('./routes/btCommonRoute');
var btDropInCheckoutRouter = require('./routes/btDropInCheckoutRoute');
var btHostedFieldsPaymentRouter = require('./routes/btHostedFieldsPaymentRoute');
var btVaultPaymentRouter = require('./routes/btVaultPaymentRoute');
var btGraphQlRouter = require('./routes/btGraphQLRoute');

//NVP
var ppNvpApiRouter = require('./routes/ppNvpApiRoute');

var app = express();
require('dotenv').config();

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// test
app.use('/', indexRouter);
app.use('/users', usersRouter);

// bt
app.use('/bt', btCommonRouter);
app.use('/bt/di/checkout', btDropInCheckoutRouter);
app.use('/bt/hf/payment', btHostedFieldsPaymentRouter);
app.use('/bt/vault/payment', btVaultPaymentRouter);
app.use('/bt/gql',btGraphQlRouter );

// pp rest api  
app.use('/ppapi/auth', authRouter);
app.use('/ppapi/payment',ppApiPaymentRouter);  //orders v1  
app.use('/ppapi/order',ppApiOrderRouter);  // orders v2
app.use('/ppapi/rt',ppApiRtRouter);
app.use('/ppapi/payout',ppApiPayoutRouter);
// nvp
app.use('/ppnvp',ppNvpApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {  
  next(createError(404));
});

app.use((req, res, next) => {
  res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Content-Security-Policy": "script-src 'nonce*' 'self' 'unsafe-eval'",
      "X-Content-Security-Policy": "default-src *",
      "X-WebKit-CSP": "default-src *"
  })
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;


