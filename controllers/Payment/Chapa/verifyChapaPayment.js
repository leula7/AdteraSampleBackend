import crypto from 'crypto';
import { BorrowedConnect, Transaction, User } from '../../../models/index.js';
import { fn, col } from 'sequelize';

const verifyChapaPayment = async (req, res) => {
  const { tx_ref } = req.body;
  const parts = tx_ref.split('-');

  // Extract values
  const user_id = parts[0];         // "1"
  let newconnect_val = parseInt(parts[1]);   // "5" (make sure it's number)
  const timestamp = parts[2];       // "1755522697081"
  const user_type = parts[3];       // "influencer"

  console.log("verify data: ", tx_ref);

  const CHAPA_WEBHOOK_SECRET = process.env.CHAPA_WEBHOOK_SECRET || "mySuperSecret123";
  const chapaSignature = req.headers['x-chapa-signature'] || req.headers['chapa-signature'];

  const hash = crypto
    .createHmac('sha256', CHAPA_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (chapaSignature !== hash) {
    console.log("⚠️ Invalid signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  // ✅ update transaction status
  await Transaction.update(
    { status: 'completed' },
    { where: { tx_ref } }
  );

  // ✅ handle repayment logic
  let repayAmount = newconnect_val;

  // fetch borrowed debts ordered by oldest
  const borrowedList = await BorrowedConnect.findAll({
    where: { borrowed_user_id: user_id },
    order: [['created_at', 'ASC']],
  });

  for (let row of borrowedList) {
    if (repayAmount <= 0) break;

    if (repayAmount >= row.borrowed_val) {
      repayAmount -= row.borrowed_val;
      row.borrowed_val = 0;
    } else {
      row.borrowed_val -= repayAmount;
      repayAmount = 0;
    }
    await row.save();
  }

  // ✅ if still have remaining repayment → add to user.connect_val
  if (repayAmount > 0) {
    await User.increment(
      { connect_val: repayAmount },
      { where: { user_id } }
    );
  }

  console.log("Repayment done, leftover added to user balance:", repayAmount);

  return res.status(200).json({ message: "Payment verified successfully" });
};

export default verifyChapaPayment;
