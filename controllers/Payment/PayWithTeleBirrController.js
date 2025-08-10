import ControlleConnect from '../All/ControlleConnect.js';
import createOrder  from './createOrder.js'; // Adjust the import path as necessary

const PayWithTeleBirrController = async (req, res) => {
  try {
    const { connect_id, connect_val } = req.body.payment;

    var title = ""
    var amount = ""; // default amount, you can change this as needed
    const response = await ControlleConnect.getConnectData(connect_id);

    if(connect_val === "0"){
      console.log("Not Custom Connect Value");
      title = response.title;
      amount = response.connect_price;
    }else{
      console.log("Custom Connect Value: ", connect_val);
      title = response.title;
      amount = response.connect_price * parseFloat(connect_val);
    }
    const paymentUrl = await new Promise((resolve, reject) => {
      createOrder(
        { body: { title: title.toString(), amount: amount.toString() } }, // simulate request
        { send: (url) => resolve(url) } // simulate responses
      );
    });
    console.log("Payment URL: ", paymentUrl);

  res.status(200).json({ message: "success", url: paymentUrl });

  } catch (err) {
    console.error('Error proxying payment request:', err);
    res.status(500).json({ error: 'Payment gateway request failed' });
  }
};

export default PayWithTeleBirrController;
