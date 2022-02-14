const express = require('express');
const router = express.Router();
const ppApiHelper = require('../helpers/ppApiHelper')

// test
router.get('/', (req, res, next) => {
  // res.status(200).send("works");
  res.status(200).send(ppApiHelper.test());

}, (error, result) => {
  if (result) {
    res.send(result);
  } else {
    res.status(500).send(error);
  }
});

// generate "access token" from PP REST API, givven merchant credenials. 
// the "access token" will be used by client request (Authorization header "Bearer") to generate 
// a client_token, client_token is the tokne used to execute the methods in PP SDK and should be created a new one 
// for each payment transaction 
router.post('/accesstoken/generate', (req, res, next) => {

  try {
    ppApiHelper.generateAccessToken((data, error) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.status(200).send(data);
      return;

    });


  }
  catch (error) {
    // handle error
    console.log(error);
    res.status(500).send(error);
  }


});

// generate client_token
router.post('/clienttoken/generate', (req, res, next) => {

  const accessToken = req.headers["authorization"];
  ppApiHelper.generateClientToken(accessToken, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });

});


module.exports = router;