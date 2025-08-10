import fetch from "node-fetch";
import https from "https";
import applyFabricToken from "./applyFabricToken.js";
import config from "./Config.js";
import { createNonceStr, createTimeStamp, signRequestObject } from "./tools.js";

// Reuse the same HTTPS agent to ignore SSL cert validation
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const createOrder = async (req, res) => {
  console.log("Creating order...");
  try {
    const title = req.body.title;
    const amount = req.body.amount;

    const applyFabricTokenResult = await applyFabricToken();
    const fabricToken = applyFabricTokenResult.token;

    const createOrderResult = await requestCreateOrder(fabricToken, title, amount);
    const prepayId = createOrderResult.biz_content.prepay_id;
    const rawRequest = createRawRequest(prepayId);

    res.send(config.webBaseUrl + rawRequest + "&version=1.0&trade_type=Checkout");
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Failed to create order");
  }
};

export const requestCreateOrder = async (fabricToken, title, amount) => {
  const reqObject = createRequestObject(title, amount);

  try {
    const response = await fetch(config.baseUrl + "/payment/v1/merchant/preOrder", {
      method: "POST",
      agent, // Use HTTPS agent here as well
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      body: JSON.stringify(reqObject),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create order: ${errorText}`);
    }

    const result = await response.json();
    console.log("Order created successfully:", result);
    return result;
  } catch (error) {
    console.error("Fetch error in requestCreateOrder:", error);
    throw error;
  }
};

function createRequestObject(title, amount) {
  const req = {
    timestamp: createTimeStamp(),
    nonce_str: createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };

  const biz = {
    notify_url: "https://www.youtube.com/watch?v=HJVOBeZsZPM",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
    redirect_url: "https://www.bing.com/",
    callback_info: "From web",
  };

  req.biz_content = biz;
  req.sign = signRequestObject(req);
  req.sign_type = "SHA256WithRSA";

  return req;
}

function createMerchantOrderId() {
  return Date.now().toString();
}

function createRawRequest(prepayId) {
  const map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: createNonceStr(),
    prepay_id: prepayId,
    timestamp: createTimeStamp(),
  };

  const sign = signRequestObject(map);

  const rawRequest = [
    `appid=${map.appid}`,
    `merch_code=${map.merch_code}`,
    `nonce_str=${map.nonce_str}`,
    `prepay_id=${map.prepay_id}`,
    `timestamp=${map.timestamp}`,
    `sign=${sign}`,
    `sign_type=SHA256WithRSA`,
  ].join("&");

  return rawRequest;
}

export default createOrder;
