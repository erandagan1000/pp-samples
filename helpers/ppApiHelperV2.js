const ppApiHelperV1 = require('../helpers/ppApiHelperV1')
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');


const test = () => {
  return "hello test"
}


const createOrder = (guid, data, callback) =>{

  ppApiHelperV1.generateAccessToken((result, error) => {
    
    if(error) {
      callback(undefined, error);
    }
    const accessToken= result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id" : guid,
        "Prefer": "return=representation"      
      }
    };
    
    // data.purchase_units[0].soft_descriptor = "MY UPDATED DESCRIPTOR";
    
    axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV2.createOrder");
        console.log("ORDER-CREATE:",data);
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

  ppApiHelperV1.generateAccessToken((result, error) => {
    
    if(error) {
      callback(undefined, error);
    }
    const accessToken= result.access_token;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"        
      }
    };
    
    const data = {};
    
    axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV2.captureOrder");
        console.log("CAPTURE:", data);
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
  createOrder,
  captureOrder,
  uuidv4
};