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
const onShippingChange = (data) => {

  console.log(data);

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

    let baseAmount = data.baseOrderAmount;

    const totalAmount = parseFloat(baseAmount) + parseFloat(data.selected_shipping_option.amount.value);
    return fetch(`https://api-m.paypal.com/v2/checkout/orders/${data.orderID}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify([{
        op: "replace",
        path: "/purchase_units/@reference_id=='default'/amount",
        value: { value: totalAmount.toString(), currency_code: "USD" },
      }])
    })
      .then((response) => response.json());


    /*
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
      */
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

module.exports = {
  test,
  createOrder,
  getOrderDetails,
  captureOrder,
  uuidv4,
  onShippingChange,
  createPaymentWithBa
};