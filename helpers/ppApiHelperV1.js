const axios = require('axios').default;

const test = () => {
  return "hello test"
}

// #region Auth Functions 
const generateAccessToken = (callback) => {

  console.log(process.env.PP_API_CLIENT_ID);
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
  axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', params, options)
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

const generateClientToken = (accessToken, callback) => {

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

const generateClientTokenWithBillingAgreementId = (accessToken, baId, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  const data = { "billing_agreement_id": baId };
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

const generateBillingAgreementToken = (accessToken, data, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if (!data.payer) {
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
          "return_url": "http://localhost:3000/pprt",
          "cancel_url": "http://localhost:3000/cancel",
          "notify_url": "http://localhost:3000/pprt",
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

const createBillingAgreement = (accessToken, data, callback) => {

  let config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if (!data) {
    callback(undefined, "Error: Billing Agreement Token Not provided");
  }

  if (!accessToken) {
    generateAccessToken((data, error) => {
      if (error) {
        console.log(error);
        return;
      }
      data.merchantName = process.env.PP_MERCHANT_NAME;
      console.log("generateAccessToken Response Payload:", data)
      const data1 = config;
      config.headers.Authorization = `Bearer ${data.access_token}`;
      axios.post('https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements', data1, config)
        .then(function (response) {
          // handle success
          const respData = response.data;
          callback(respData, undefined);
        })
        .catch(function (error) {
          // handle error
          console.log(error.response.data);
          callback(undefined, error)
        });

    });

  }
  else {  //access token sent from client - it is in some examples 
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
      });
  }


}

const createPayment = (accessToken, data, callback) => {

  let config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if (!data) {
    callback(undefined, "Error: Payment data not provided");
  }


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
    });

}

const getBillingAgreementDetails = (accessToken, baId, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json"
    }
  };
  if (!baId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }

  // generate access token, givven merchant credenials
  axios.get(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements/${baId}`, config)
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

const getBillingAgreementTokenDetails = (accessToken, baTokenId, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if (!baTokenId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }

  // generate access token, givven merchant credenials
  axios.get(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreement-tokens/${baTokenId}`, config)
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

const updateBillingAgreementDetails = (accessToken, baId, data, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if (!baId) {
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

const cancelBillingAgreementDetails = (accessToken, baId, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  if (!baId) {
    callback(undefined, "Error: Beeling Agreement Id not not provided");
  }

  // generate access token, givven merchant credenials
  axios.post(`https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements/${baId}/cancel`, config)
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

// #region Payouts Functions

const createPayout = (accessToken, callback) => {

  const config = {
    headers: {
      "Authorization": accessToken,
      "Content-Type": "application/json"
    }
  };

  data = {
    "sender_batch_header": {
      "sender_batch_id": "2014021801",
      "recipient_type": "EMAIL",
      "email_subject": "You have money!",
      "email_message": "You received a payment. Thanks for using our service!"
    },
    "items": [
      {
        "amount": {
          "value": "9.87",
          "currency": "USD"
        },
        "sender_item_id": "201403140001",
        "recipient_wallet": "PAYPAL",
        "receiver": "eran.buyer@email.com"
      },
      {
        "amount": {
          "value": "112.34",
          "currency": "USD"
        },
        "sender_item_id": "201403140002",
        "recipient_wallet": "PAYPAL",
        "receiver": "eran.m.uk@merchant.com"
      },
      // {
      //   "recipient_type": "PHONE",
      //   "amount": {
      //     "value": "5.32",
      //     "currency": "USD"
      //   },
      //   "note": "Thanks for using our service!",
      //   "sender_item_id": "201403140003",
      //   "recipient_wallet": "VENMO",
      //   "receiver": "<408-234-1234>"
      // }
    ]
  };


  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/payments/payouts', data, config)
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
  generateClientTokenWithBillingAgreementId,
  createBillingAgreement,
  createPayment,
  getBillingAgreementDetails,
  getBillingAgreementTokenDetails,
  updateBillingAgreementDetails,
  cancelBillingAgreementDetails,
  createPayout

};