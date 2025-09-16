import { Transaction, User } from '../../../models/index.js';
import ControlleConnect from '../../All/ControlleConnect.js';
import fetch from 'node-fetch'; // Node 18+ has global fetch

const PaywithChapa = async (req, res) => {
  try {
    const { connect_id, connect_val } = req.body.payment;
    let amount = 0;
    const { user_id, user_type } = req.user;
    let title = ""
    let newval = 0
    console.log("Payment Data:", req.body.payment);
    // Get user details
    const userData = await User.findOne({
      where: { user_id },
      attributes: ['first_name','last_name','email','phone_number']
    });


    if (!userData) return res.status(404).json({ error: "User not found" });

    // Generate transaction reference

    // Get connect info
    const response = await ControlleConnect.getConnectData(connect_id);

    if(connect_val === "0"){
      console.log("Not Custom Connect Value");
      title = response.title;
      amount = response.connect_price;
      newval = response.connect_value
    }else{
      console.log("Custom Connect Value: ", connect_val);
      title = response.title;
      amount = response.connect_price * parseFloat(connect_val);
      newval = connect_val
    }
    amount = connect_val === "0"
      ? response.connect_price
      : response.connect_price * parseFloat(connect_val);

    const tx_ref = `${user_id}-${newval}-${Date.now()}-${user_type}`;

    const payload = {
        amount: amount.toString(),
        currency: "ETB",
        email: userData.email || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        phone_number: '+251923801192',
        connect_val: connect_val,
        tx_ref,
        callback_url: "https://991e73ab2e1d.ngrok-free.app/api/auth/verifychapapayment", //Backend
      //  return_url: "https://ef9ba3179d29.ngrok-free.app/buyconnect/success" ,// UI
        customization: {
            title: response.title.substring(0, 16),
            description: response.description.substring(0, 16)
            },

        meta: {
        hide_receipt: false
        }
    };
    const transData = {
        user_id,
        connect_id,
        tx_ref,
        amount,
        status: 'pending',
        transaction_type: "chapa"
    }
    console.log("trans data: ",transData)
    try {
        var intialpayment = await Transaction.create(transData);
        console.log("Initial payment created:");
    } catch (error) {
        console.log("error on creating intial payment: ", error);
    }
        if (!intialpayment) {
            return res.status(500).json({ error: "Failed to create initial transaction on db" });
        }

        // Call Chapa API
        try {
            console.log("Calling Chapa API with payload:");
            const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer CHASECK_TEST-rtwvywNcGXfrN7RGAqIrDscHmN099tfT"
            },
            body: JSON.stringify(payload)
        });

        const response = await chapaResponse.json();
        const data = {
            ...response.data,        // expand the `data` object
            status: response.status, // just copy directly
            message: response.message
            };

        res.json(data);

        } catch (error) {
            console.log("error chapa: ",error);
            res.status(500).json({ error: 'Chapa payment request failed' });
        }

    // Send Chapa response back to frontend

  } catch (err) {
    console.error('Error proxying payment request:', err);
    res.status(500).json({ error: 'Payment gateway request failed' });
  }
};

export default PaywithChapa;
