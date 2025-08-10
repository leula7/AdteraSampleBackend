function startPay() {
  console.log("Mini App: Starting payment process...");
  const title = "add your own title here"; // Replace with actual title
  const amount = "add your own amount here"; // Replace with actual amount

  console.log("Mini App: Starting payment request...");

  ma.request({
    url: baseUrl + "/create/order",
    method: "POST",
    data: {
      title: title,
      amount: amount,
    },
    success: (res) => {
      if (res.data) {
        console.log("Mini App: Payment data received:", res.data);
        launchPayment(res.data);
      } else {
        ma.showToast({ title: "Error: No payment data received" });
      }
    },
    fail: (err) => {
      console.log("Mini App: Payment request failed:", err);
      ma.showToast({ title: "Payment request failed: " + err.message });
    },
  });
}

function launchPayment(rawRequest) {
  if (!rawRequest) {
    ma.showToast({ title: "Error: Invalid payment request" });
    return;
  }

  console.log("Mini App: Initiating payment with:", rawRequest.trim());

  ma.startPay({
    rawRequest: rawRequest.trim(),
    success: (res) => {
      console.log("Mini App: Payment success response:", res);
      ma.showToast({ title: "Payment Success: " + res.resultCode });
    },
    fail: (err) => {
      console.log("Mini App: Payment failed:", err);
      ma.showToast({ title: "Payment failed: " + err.message });
    },
  });
}
