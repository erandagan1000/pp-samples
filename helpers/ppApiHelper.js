const axios = require('axios').default;
const test = () => {
  return "hello test"
}

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

const createOrder = (callback) =>{

  generateAccessToken((result, error) => {
    
    if(error) {
      callback(undefined, error);
    }
    const accessToken= result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",      
      }
    };
    
    const data = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: "100.00"
          }
        }
      ]
    };
    
    axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', data, config)
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
  });
}

const captureOrder = (orderId, callback) =>{

  generateAccessToken((result, error) => {
    
    if(error) {
      callback(undefined, error);
    }
    const accessToken= result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",      
      }
    };
    
    const data = {};
    
    axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, data, config)
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
  });
    
}



module.exports = {
  test,
  generateAccessToken,
  generateClientToken,
  createOrder,
  captureOrder
};