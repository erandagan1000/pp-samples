const axios = require('axios').default;


const test = () => {
  return "hello test"
}

// #region Auth Functions 

const generateAccessToken = (callback, guid) => {

  console.log(process.env.PP_API_CLIENT_ID);
  const options = {
    auth: {
      username: process.env.PP_API_CLIENT_ID,
      password: process.env.PP_API_CLIENT_SECRET
    }
  };
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  // added according to Vault V3 doc
  params.append('response_type', 'id_token');
  // params.append('Content-Type', 'application/x-www-form-urlencoded');
  params.append('PayPal-Request-Id', guid);
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
    });

}

const generateClientToken = (accessToken, payload, callback) => {

  const config = {
    headers: {
      Authorization: accessToken,
    }
  };
  const data = payload ? payload : {};
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
      "Prefer": "return=representation",
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Accept-Language": "en_US"

    }
  };
  const data = {
    //claims: ["billing_agreement_id", baId],
    grant_type: 'client_credentials',
    response_type: "id_token",
    billing_agreement_id: baId
  };

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
      console.log("error: ", error.response.data.details[0].description);
      callback(undefined, error)
    })

}

const generateClientTokenWithCustomerId = (accessToken, customerId, callback) => {


  const config = {

    headers: {
      "Authorization": accessToken,
      "Prefer": "return=representation",
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"

    }
  };
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  // added according to Vault V3 doc
  data.append('response_type', 'id_token');
  // Vault style (new)
  data.append('target_customer_id', customerId);

  // generate access token, givven merchant credenials
  axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', data, config)
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

const getUserInfo = (callback) => {

  generateAccessToken((result, error) => {

    if (error) {
      callback(undefined, error);
    }
    const accessToken = result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        "Prefer": "return=representation"
      }
    };

    axios.get('https://api-m.sandbox.paypal.com/v1/identity/openidconnect/userinfo?schema=openid', config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV1.getUserInfo");
        console.log("USER-INFO:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(undefined, error)
      })
  });








  
  

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
      "description": "Billing Agreement Custom Description",
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

const createPayment = (guid, data, callback) => {

  generateAccessToken((result, error) => {

    if (error) {
      callback(undefined, error);
    }
    const accessToken = result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": guid,
        "Prefer": "return=representation"
      }
    };
    // data.purchase_units[0].soft_descriptor = "MY UPDATED DESCRIPTOR";

    axios.post('https://api-m.sandbox.paypal.com/v1/payments/payment', data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV1.payment");
        console.log("PAYMENT-CREATED:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(undefined, error)
      })
  });
}

const getPayment = (guid, paymentId, callback) => {

  generateAccessToken((result, error) => {

    if (error) {
      callback(undefined, error);
    }
    const accessToken = result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": guid,
        "Prefer": "return=representation"
      }
    };

    axios.get(`https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}`, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        callback(data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(error);
      })



  });
}

const executePayment = (guid, paymentId, callback) => {

  generateAccessToken((result, error) => {

    if (error) {
      callback(undefined, error);
    }
    const accessToken = result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": guid,
        "Prefer": "return=representation"
      }
    };
    data = { "payer_id": "CTNJMD9U7U9N2"};
    
    axios.post(`https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV1.paymentExecute");
        console.log("PAYMENT-EXECUTED:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error, " | ", error.response.data.message);
        callback(undefined, error.response.data.message)
      })
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

// #region PAYOUTS Functions

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

const onShippingChange = (data, callback) => {

  console.log(data);

  generateAccessToken((result, error) => {

    if (error) {
      callback(undefined, error);
    }
    const accessToken = result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      }
    };
    
    let arrayOfUpdates = [
      
      {
          "op": "add",
          "path": "/transactions/0/item_list/shipping_address",
         "value": {"recipient_name":"Yi Zhao","phone":"18655817","line1":"512 El Cerrito Plz Unit 109","city":"El Cerrito","country_code":"US","postal_code":"94530","state":"CA"}
      // "value": {"recipient_name":"Ifeanyi Ezenagu","phone":"+12404443411","line1":"12809 RICKER RD","city":"UPPER MARLBORO","country_code":"US","postal_code":"20772","state":"MD"}  
    }
      
  ];
    
    /*
    let updatedAddress = data.updatedAddress;
    let baseAmount = data.baseOrderAmount || 0;
    // const totalAmount = parseFloat(baseAmount) + parseFloat(data.selected_shipping_option.amount.value);
    const totalAmount = "220.00";

    arrayOfUpdates.push({
      op: "replace",
      path: "/purchase_units/@reference_id=='default'/amount",
      value: { value: totalAmount.toString() || "222.00", currency_code: "USD" },
    });

    if (updatedAddress) {
      arrayOfUpdates.push({
        op: "add",
        path: "/transactions/0/item_list/shipping_address",
        value: updatedAddress
      })
    }
    */

    let paymentId = data.orderID;
    var payload = JSON.stringify(arrayOfUpdates);
    axios.patch(`https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}`, payload, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV1.paymentPatched");
        console.log("PAYMENT-PATACHED:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error.response.data.message);
        console.log(error.response.data.details);
          callback(undefined, error.response.data.details)
      })
    
  });


}



// #endregion


module.exports = {
  test,
  generateAccessToken,
  generateClientToken,
  generateBillingAgreementToken,
  generateClientTokenWithBillingAgreementId,
  generateClientTokenWithCustomerId,
  getUserInfo,
  createBillingAgreement,
  createPayment,
  getPayment,
  executePayment,
  getBillingAgreementDetails,
  getBillingAgreementTokenDetails,
  updateBillingAgreementDetails,
  cancelBillingAgreementDetails,
  createPayout,
  onShippingChange

};