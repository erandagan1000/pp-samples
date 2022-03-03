const axios = require('axios').default;
const test = () => {
  return "hello test"
}

// #region Auth Functions 
const generateAccessToken = (callback) =>{

  const options = {
    auth: {
      username: process.env.PP_API_CLIENT_ID,
      password: process.env.PP_API_CLIENT_SECRET
    }
  };
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  // console.log(options);

  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token',params, options)
  .then(function (response) {
    // handle success
    const data = response.data;
    callback(data, undefined);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    callback(undefined, error);
  })
  
}

const generateClientToken = (accessToken, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  const data = {};
  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/identity/generate-token', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })
  
}

// #endregion

// #region Billing Agreement Functions

const generateBillingAgreementToken = (accessToken, data, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if(!data.payer) {
    data = {
      "description": "Billing Agreement",
      "shipping_address":
      {
        "line1": "1350 North First Street",
        "city": "San Jose",
        "state": "CA",
        "postal_code": "95112",
        "country_code": "US",
        "recipient_name": "John Doe"
      },
      "payer":
      {
        "payment_method": "PAYPAL"
      },
      "plan":
      {
        "type": "MERCHANT_INITIATED_BILLING",
        "merchant_preferences":
        {
          "return_url": "https://example.com/return",
          "cancel_url": "https://example.com/cancel",
          "notify_url": "https://example.com/notify",
          "accepted_pymt_type": "INSTANT",
          "skip_shipping_address": false,
          "immutable_shipping_address": true
        }
      }
    };
  }
  
  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/billing-agreements/agreement-tokens', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })
  
}

const createBillingAgreement = (accessToken, data, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if(!data) {
    callback(undefined, "Error: Billing Agreement Token Not provided");
  }
  
  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })
  
}

const createPayment = (accessToken, data, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if(!data) {
    callback(undefined, "Error: Payment data not provided");
  }
  
  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/payments/payment', data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error.response.data);
      callback(undefined, error)
    })
  
}

const getBillingAgreementDetails = (accessToken, baId, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json"
    }
  };
  if(!baId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }
  
  // generate access token, givven merchant credenials
  axios.get(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements/${baId}`, undefined, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle errorx1
      console.log(error);
      callback(undefined, error)
    })
  
}

const getBillingAgreementTokenDetails = (accessToken, baTokenId, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if(!baTokenId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }
  
  // generate access token, givven merchant credenials
  axios.get(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreement-tokens/${baTokenId}`, undefined, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })
  
}

const updateBillingAgreementDetails = (accessToken, baId, data, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if(!baId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }
  
  // generate access token, givven merchant credenials
  axios.patch(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements/${baId}`, data, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })
  
}

const cancelBillingAgreementDetails = (accessToken, baId, callback) =>{

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if(!baId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }
  
  // generate access token, givven merchant credenials
  axios.post(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements/${baId}/cancel`, undefined, config)
    .then(function (response) {
      // handle success
      const data = response.data;
      callback(data, undefined);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      callback(undefined, error)
    })
  
}

// #endregion

module.exports = {
  test,
  generateAccessToken,
  generateClientToken,
  generateBillingAgreementToken,
  createBillingAgreement,
  createPayment,
  getBillingAgreementDetails,
  getBillingAgreementTokenDetails,
  updateBillingAgreementDetails,
  cancelBillingAgreementDetails
  
};