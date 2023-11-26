
const { default: axios } = require('axios');
const express = require('express');
const { route } = require('.');
const router = express.Router();
const ppApiHelperV2 = require('../helpers/ppApiHelperV2')

// route: /ppapi/order
// create order
router.post('/', (req, res, next) => {

  let defaultPayload = {
    intent: "CAPTURE",
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "ERAN BRAND FROM EXPERIENCE CONTEXT",
          // shipping_preference: "GET_FROM_FILE", //NO_SHIPPING or SET_PROVIDED_ADDRESS
          // landing_page: "LOGIN", //GUEST_CHECKOUT or NO_PREFERENCE
          user_action: "PAY_NOW",//PAY_NOW or CONTINUE
          return_url: "htttp://localhost:3000",
          cancel_url: "htttp://localhost:3000"
        },
        // email_address: "eran.buyer.us@email.com",
        // //name: "Eran Buyer US",
        // address: {
        //   address_line_1: "Address Line 1", address_line_2: "Address Line 2", postal_code: "1234567",admin_area_2:"admin_area_2", country_code: "US"
        // },
      }
    },
    purchase_units: [
      {
        amount:
          { currency_code: "USD", value: "115.00" },
        // shipping: {
        //   address: {
        //     address_line_1: "Purchase Unit Address Line 1", address_line_2: "Address Line 2", postal_code: "1234567", admin_area_2:"admin_area_2" , country_code: "US"
        //   }
        // }
      },
    ],

  };

  var payload = req.body && req.body.intent ? req.body : defaultPayload;

  var additions = { paypal: { experience_context: { brand_name: "ERAN BRAND FROM EXPERIENCE CONTEXT" } } };
  var payload1 = { ...payload, payment_source: additions };

  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV2.createOrder(guid, payload1, (data, error) => {
    if (error) {
      res.status(500).send(error);
      console.log(error.response.data.details)
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// patch order
router.patch('/', (req, res, next) => {

  const payload = req.body;

  ppApiHelperV2.onShippingChange(payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});


router.post('/lpm/sofort', (req, res, next) => {

  const guid = ppApiHelperV2.uuidv4();
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: guid,
        amount: {
          currency_code: "GBP",
          value: "102.00"
        }
      }
    ],
    payment_source: {
      sofort: {
        country_code: "GB",
        name: "John Doe",
        email: "john.doe@example.com"
      }
    },
    processing_instruction: "ORDER_COMPLETE_ON_PAYMENT_APPROVAL",
    application_context: {
      locale: "en-GB",
      return_url: "https://b2de-94-188-131-64.ngrok.io/lpm/success",
      cancel_url: "https://b2de-94-188-131-64.ngrok.io/cancelUrl"
    }
  };

  ppApiHelperV2.createOrder(guid, payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// capture order with orderId in path
router.post('/:id/capture', (req, res, next) => {

  orderId = req.params.id;
  ppApiHelperV2.captureOrder(orderId, (data, error) => {
    if (error) {
      res.status(500).send(error.response.data);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// capture order with orderId in body
router.post('/capture', (req, res, next) => {

  orderId = req.body.orderId;
  ppApiHelperV2.captureOrder(orderId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

//server2server - Card On File / CardOnFile

router.post('/s2s', (req, res, next) => {
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "115.00"
        }
      }
    ],
    payment_source: {
      card: {
        number: "4032036503389346",
        expiry: "2026-01",
        name: "John Doe",
        billing_address: {
          address_line_1: "2211 N First Street",
          address_line_2: "17.3.160",
          admin_area_1: "CA",
          admin_area_2: "San Jose",
          postal_code: "95131",
          country_code: "US"
        },
        attributes: {
          verification: {
            method: "SCA_WHEN_REQUIRED"
          }
        }
      }
    }
  };

  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV2.createOrder(guid, payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });


});

// create order and vault payment method - Vault V3.
router.post('/vault-payment-method', (req, res, next) => {

  let paymentSource = req.body.source;
  let payment_source = undefined;
  let vaultAttributes = {
    vault: {
      permit_multiple_payment_tokens: paymentSource == "card",  // false for paypal, true for card
      store_in_vault: "ON_SUCCESS",
      usage_type: "MERCHANT",
      customer_type: "CONSUMER"
    }
  };

  if (paymentSource == "paypal") {
    payment_source = {
      paypal: {
        // experience_context generate error when is sent with attributes.vault
        // experience_context: {
        //   brand_name: "ERAN BRAND FROM EXPERIENCE CONTEXT",
        //   locale: "en-US",
        //   landing_page: "LOGIN",
        //   return_url: "htttp://localhost:3000",
        //   cancel_url: "htttp://localhost:3000"
        // },
        attributes: vaultAttributes
      }
    }
  }
  else if (paymentSource == "card") {
    payment_source = {
      card: {
        attributes: vaultAttributes
      },
      experience_context: {
        shipping_preference: "NO_SHIPPING",
        return_url: "https://example.com/returnUrl",
        cancel_url: "https://example.com/cancelUrl",
      },
    };
  }



  let defaultPayload = {
    intent: "CAPTURE",
    application_context: {
      brand_name: "Jon Doe's Clothing Shop",
      locale: "en-US",
      landing_page: "LOGIN",
      return_url: "https://example.com/returnUrl",
      cancel_url: "https://www.paypal.com/checkoutnow/error"
    },
    purchase_units: [
      {
        amount:
          { currency_code: "USD", value: "115.00" },

      },
    ],
    payment_source

  };

  var payload = req.body && req.body.intent ? req.body : defaultPayload;

  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV2.createOrder(guid, payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      console.log(error.response.data.details)
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// create order ofr returning user Vault V3.
router.post('/vault-checkout', (req, res, next) => {

  let paymentSource = req.body.source;
  let payment_source = undefined;

  if (paymentSource == "paypal") {
    payment_source = {
      paypal: {
        experience_context: {
          shipping_preference: "SET_PROVIDED_ADDRESS",
          brand_name: "ERAN BRAND FROM EXPERIENCE CONTEXT",
          locale: "en-US",
          landing_page: "LOGIN",
          return_url: "htttp://localhost:3000",
          cancel_url: "htttp://localhost:3000"
        }
      }
    }
  }
  else if (paymentSource == "card") {
    payment_source = {
      card: {},
      experience_context: {
        shipping_preference: "SET_PROVIDED_ADDRESS",
        return_url: "https://example.com/returnUrl",
        cancel_url: "https://example.com/cancelUrl",
      },
    };
  }



  let defaultPayload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount:
          { currency_code: "USD", value: "115.00" },
        shipping: {
          type: "SHIPPING",
          name: {
            full_name: "John Doe"
          },
          address: {
            country_code: "FR",
            postal_code: "75002",
            address_line_1: "21 Rue de la banque",
            admin_area_1: "France",
            admin_area_2: "Paris"
          }
        }
      },
    ],
    payment_source,
    /*application_context: {
      brand_name: "Jon Doe's Clothing Shop",
      locale: "en-US",
      landing_page: "LOGIN",
      return_url: "https://example.com/returnUrl",
      cancel_url: "https://www.paypal.com/checkoutnow/error"
    }*/
  };

  var payload = defaultPayload;

  const guid = ppApiHelperV2.uuidv4();

  ppApiHelperV2.createOrder(guid, payload, (data, error) => {
    if (error) {
      res.status(500).send(error);
      console.log(error.response.data.details)
      return;
    }
    res.status(200).send(data);
    return;

  });
});

// order details
router.post('/:id', (req, res, next) => {

  orderId = req.params.id;
  ppApiHelperV2.getOrderDetails(orderId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});

router.get('/vault-payment-tokens/:customerid', (req, res, next) => {

  var customerId = req.params.customerid;
  ppApiHelperV2.getSavedPaymentMethodsForCustomer(customerId, (data, error) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).send(data);
    return;

  });
});


module.exports = router;