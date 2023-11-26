var express = require("express");
var btHelper = require("../helpers/braintreeHelper");
var router = express.Router();
var randomstring = require("randomstring");

// base route: bt/vault/payment

// #region Token Functions
router.get("/client_token", (req, res) => {

  //Expect payload {merchant_account_id: xxx}  if merchant uses multiple PP account linked to the same BT gateway (MID)
  // he will need to specify the MAID to use, it should be the one connnected in BT Console where he linked the PP asccount
  let selectedCurrency = req.query.currency;
  if (selectedCurrency && !btHelper.isECBT) {
    payload = { merchant_account_id: btHelper.getMerchantAccountIdByCurrency(selectedCurrency) };
  }
  else {
    payload = {};
  }

  btHelper.gateway.clientToken.generate(payload).then((response) => {
    console.log(response);
    res.send(response.clientToken);
  });
});

router.get("/client_token/:customerid", (req, res) => {
  const customerId = req.params.customerid;
  btHelper.gateway.clientToken.generate({ customerId: customerId }).then((response) => {
    // console.log(response);
    res.send(response.clientToken);
  });
});

// #endregion

// #region checkout Functions

router.post("/checkout", (req, res) => {
  var nonceFromTheClient = req.body.paymentMethodNonce;
  var amount = req.body.amount || "25.00";
  const selectedCurrency = req.body.currency || "USD";
  var storeInVault = (req.body.hf_save_for_next_purchase && req.body.hf_save_for_next_purchase == 'true') || false;
  console.log("store in vault: ", storeInVault);

  // set merchantAccountId by selected presntment currency

  const merchantAccountId = btHelper.isECBT ? undefined : btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  let submitForSettlement = true;
  if (req.body.isAuthorizeRequest && req.body.isAuthorizeRequest == 'true') {
    submitForSettlement = false;
  }
  console.log("submitForSettlement: ", submitForSettlement);

  let requestParams = {}
  console.log("btHelper.isECBT: ", btHelper.isECBT);
  if (btHelper.isECBT) {
    requestParams = {
      amount,
      paymentMethodNonce: nonceFromTheClient,

      options: {
        submitForSettlement
      },
      //just to test if it is passed with ECBT
      customFields: {
        age: "30"
      }
    }
  }
  else {
    let qty1 = 1, qty2 = 3;
    let taxPerUnit = 1.00;
    let totalTax = (qty1 + qty2) * taxPerUnit;
    requestParams = {
      amount: amount * (qty1 + qty2) + totalTax,
      purchaseOrderNumber: "12345",
      taxAmount: totalTax,
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
      descriptor: {
        name: 'ERUS   *DYN DESCRIPTOR',  //[section]*[prodcut desc] - section must be same value as in Admin "CC Statement name"
        //section must be either 3, 7 or 12 characters and the product descriptor can be up to 18, 14, or 9 characters respectively 
        // phone: '8044822122',          //(with an * in between for a total descriptor name of 22
        //url: 'erandagan.com',
      },
      // customer: {
      //   firstName: "Jen",
      //   lastName: "Smith",
      //   company: "Braintree",
      //   email: "jen@example.com",
      //   phone: "312.555.1234",
      //   fax: "614.555.5678",
      //   website: "www.example.com"
      // },
      // billing: {
      //   firstName: "Paul",
      //   lastName: "Smith",
      //   company: "Braintree",
      //   streetAddress: "1 E Main St",
      //   extendedAddress: "Suite 403",
      //   locality: "Chicago",
      //   region: "IL",
      //   postalCode: "60622",
      //   countryCodeAlpha2: "US"
      // },
      shipping: {
        firstName: "Jen",
        lastName: "Smith",
        company: "Braintree",
        streetAddress: "1 E 1st St",
        extendedAddress: "5th Floor",
        locality: "Bartlett",
        region: "IL",
        postalCode: "60103",
        countryCodeAlpha2: "US"
      },

      lineItems: [
        {
          name: "Item 1 desc",
          kind: "debit",
          quantity: qty1,
          unitAmount: amount,
          unitOfMeasure: "unit",
          totalAmount: qty1 * amount,
          taxAmount: taxPerUnit,
          discountAmount: "0.00",
          productCode: "54321",
          commodityCode: "98765"
        },
        {
          name: "Item 2 desc",
          kind: "debit",
          quantity: qty2,
          unitAmount: amount,
          unitOfMeasure: "unit",
          totalAmount: qty2 * amount,
          taxAmount: taxPerUnit,
          discountAmount: "0.00",
          productCode: "54321",
          commodityCode: "98765"
        }
      ],
      options: {
        submitForSettlement,
        storeInVaultOnSuccess: storeInVault,
        storeShippingAddressInVault: storeInVault,
        paypal: {
          "description": "Product xx description from options"
        }
      },
      customFields: {
        age: "30"
      }
    }

  }



  btHelper.gateway.transaction.sale(
    requestParams,
    (err, result) => {
      //const fullResult = JSON.stringify(result)
      res.send(result);

    }
  );
});

router.post('/vault', (req, res, next) => {

  const selectedCurrency = req.body.currency;
  // set merchantAccountId by selected presntment currency
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);
  const deviceData = req.body.deviceData || '';
  console.log("deviceData", deviceData);

  const saleRequest = {
    amount: req.body.amount,
    paymentMethodNonce: req.body.paymentMethodNonce,
    merchantAccountId: merchantAccountId,
    deviceData: req.body.deviceData || '',
    orderId: randomstring.generate(7), //"Mapped to PayPal Invoice Number",
    options: {
      submitForSettlement: true,
      storeInVaultOnSuccess: true,
      paypal: {
        customField: "PayPal custom field",
        description: "Description for PayPal email receipt",
      },
    },
    customer: {}
  };

  btHelper.gateway.transaction.sale(saleRequest).then(result => {
    if (result.success) {
      console.log("Success! Transaction ID: " + result.transaction.id);
      res.status(200).send(result);
    } else {
      console.log("Error:  " + result.message);
    }
  }).catch(err => {
    console.log("Error:  " + err);
    res.status(500).send(err)
  });


});


router.post("/checkout/localpaymethod", (req, res) => {
  var nonceFromTheClient = req.body.paymentMethodNonce;   //from client or from webhook 
  var amount = req.body.amount;
  var orderId = randomstring.generate(5);
  var descriptorName = "Eran Merchant US";
  const selectedCurrency = req.body.currency;
  // set merchantAccountId by selected presntment currency
  const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

  btHelper.gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce: nonceFromTheClient,
      merchantAccountId: merchantAccountId,
      orderId,
      //descriptorName: descriptorName,
      options: {
        submitForSettlement: true,
      },
    }).then(result => {
      if (result.success) {

        const message = "Success! Transaction ID: " + result.transaction.id;
        const response = { message, success: result.success, transaction: result.transaction };
        console.log(response);
        res.status(200).send(response);
      } else {
        const errMessage = "Error:  " + result.message;
        const errResponse = { message: errMessage, success: result.success, transaction: undefined };
        console.log(errResponse);
        res.status(400).send(errResponse);
      }
    }).catch(err => {
      console.log("Error:  " + err);
      res.status(500).send(err);
    });

});
router.post("/checkout/ach", (req, res) => {
  var nonceFromTheClient = req.body.paymentMethodNonce;
  var amount = req.body.amount || "25.00";

  const selectedCurrency = req.body.currency || "USD";
  var storeInVault = (req.body.hf_save_for_next_purchase && req.body.hf_save_for_next_purchase == 'true') || true;
  console.log("store in vault: ", storeInVault);

  /* MUST VAULT and VERIFY Customer if want to charge with ACH*/

  var customer = {
    firstName: "Jen",
    lastName: "Smith",
    company: "Braintree",
    email: "jen@example.com",
    phone: "312.555.1234",
    fax: "614.555.5678",
    website: "www.example.com"
  };
  btHelper.customerCreate(customer).then(function (savedCustomer) {

    console.log(savedCustomer);

    var options = {};
    if (req.body.checkOption == 1) {
      options = {
        usBankAccountVerificationMethod: btHelper.braintree.UsBankAccountVerification.VerificationMethod.NetworkCheck,   // or MicroTransfers or IndependentCheck
        //verificationAddOns: btHelper.braintree.UsBankAccountVerification.VerificationAddOns.CustomerVerification  //optional, only applies to network check verifications.
      }
    }

    btHelper.paymentMetohdCreate({
      customerId: savedCustomer.customer.id,
      paymentMethodNonce: nonceFromTheClient,
      options
    }).then(function (savedPaymentMethod) {
      console.log("SAVED PAYMENT METHOD: ", savedPaymentMethod);
      const usBankAccount = savedPaymentMethod.usBankAccount;
      const verified = usBankAccount.verified;
      const responseCode = usBankAccount.verifications[0]?.processorResponseCode;
      console.log("BANK ACCOUNT: ", `${usBankAccount} | ${verified} | ${responseCode}`);
      const merchantAccountId = btHelper.getMerchantAccountIdByCurrency(selectedCurrency);

      let submitForSettlement = true;

      console.log("submitForSettlement: ", submitForSettlement);

      let requestParams = {
        amount,
        purchaseOrderNumber: "12345",
        customerId: savedCustomer.customer.id,
        merchantAccountId: merchantAccountId,  //if ommitted the default MID (configured on BT console) will be used
        descriptor: {
          // name: 'ERUS   *DYN DESCRIPTOR',  //[section]*[prodcut desc] - section must be same value as in Admin "CC Statement name"
          //section must be either 3, 7 or 12 characters and the product descriptor can be up to 18, 14, or 9 characters respectively 
          // phone: '8044822122',          //(with an * in between for a total descriptor name of 22
          //url: 'erandagan.com',
          name: 'ERU*DYN DESCR',
        },
        options: {
          submitForSettlement,
          storeInVaultOnSuccess: storeInVault,
          storeShippingAddressInVault: storeInVault,
          paypal: {
            "description": "Product xx description from options"
          },

        },
        transactionSource: "unscheduled"
      }

      btHelper.gateway.transaction.sale(
        requestParams,
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send(err)
          }
          //const fullResult = JSON.stringify(result)
          res.send(result);

        }
      );


    }).catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });
  })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.status(500).send(error);
    });




});

// #endregion

module.exports = router;
