const ppApiHelperV1 = require('../helpers/ppApiHelperV1')
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');


const test = () => {
  return "hello test"
}


const createOrder = (guid, data, callback) => {

  ppApiHelperV1.generateAccessToken((result, error) => {

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

    axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV2.createOrder");
        console.log("ORDER-CREATED:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(undefined, error)
      })
  });
}

const getOrderDetails = (orderId, callback) => {

  ppApiHelperV1.generateAccessToken((result, error) => {

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

    axios.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV2.getOrderDetails");
        console.log("ORDER:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(undefined, error)
      })
  });

}

const captureOrder = (orderId, callback) => {

  ppApiHelperV1.generateAccessToken((result, error) => {

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

// use the orders api to update an order
const onShippingChange = (data, callback) => {

  console.log(data);
  let baseAmount = data.baseOrderAmount;
    const totalAmount = parseFloat(baseAmount) + parseFloat(data.selectedShippingOption.amount.value);
    let updatedAddress = data.updatedAddress;
    let arrayOfUpdates = [];

    arrayOfUpdates.push({
      op: "replace",
      path: "/purchase_units/@reference_id=='b16b98ad-08b1-4f4c-83db-8f7ed4df6559'/amount",
      value: { value: totalAmount.toString(), currency_code: "USD" },
    });

    if(updatedAddress) {
      arrayOfUpdates.push({
        op: "add",
        path: "/purchase_units/@reference_id=='b16b98ad-08b1-4f4c-83db-8f7ed4df6559'/shipping/address",
        value: updatedAddress
      })
    }

  
  ppApiHelperV1.generateAccessToken((result, error) => {

    if (error) {
      callback(undefined, error);
    }
    const accessToken = result.access_token;
    const config = {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      }
    };
    console.log(accessToken);
    
    var dat = JSON.stringify(arrayOfUpdates);
    
    axios.patch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${data.orderID}`, dat, config)
      .then((response) => {
        console.log(response.data);
        callback(response.data, undefined);

      }).catch((err) => {
        console.log(err);
        callback(undefined, err);
      });
    
  });


}

// create payment with BA using orders v2 call
const createPaymentWithBa = (accessToken, data, clientMetaDataId, callback) => {

  

  let config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": accessToken,
      "PAYPAL-CLIENT-METADATA-ID": clientMetaDataId,
      "paypal-request-id" : clientMetaDataId
    }
  };
  if (!data) {
    callback(undefined, "Error: Payment data not provided");
  }


  axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', data, config)
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

//vault v3
const getSavedPaymentMethodsForCustomer = (customerId, callback) => {
  ppApiHelperV1.generateAccessToken((result, error) => {

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

    
    const data = {};

    axios.get(`https://api-m.sandbox.paypal.com/v3/vault/payment-tokens?customer_id=${customerId}`, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("getPaymentTokens");
        console.log("data:", data);
       
        
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(undefined, error)
      })
  });


}

const vaultSetupTokens = (guid, data, callback) => {

  ppApiHelperV1.generateAccessToken((result, error) => {

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

    axios.post('https://api-m.sandbox.paypal.com/v3/vault/setup-tokens', data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV2.setupTokens");
        console.log("DATA:", data);
        callback(data, undefined);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        callback(undefined, error)
      })
  });
}

const vaultCreatePaymentToken = (guid, data, callback) => {

  ppApiHelperV1.generateAccessToken((result, error) => {

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

    axios.post('https://api-m.sandbox.paypal.com/v3/vault/payment-tokens', data, config)
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("ppApiHelperV2.setupTokens");
        console.log("DATA:", data);
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
  getOrderDetails,
  captureOrder,
  uuidv4,
  onShippingChange,
  createPaymentWithBa,
  getSavedPaymentMethodsForCustomer,
  vaultSetupTokens,
  vaultCreatePaymentToken
} ;