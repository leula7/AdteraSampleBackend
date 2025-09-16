import { Transaction } from "../../models/index.js";



const userTransactionController = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {limit,offset} = req.query;
    console.log("transactioning")

    const transactions = await Transaction.findAll({
      where: { user_id },
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });


    res.status(200).json({ transactions});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve favorites. Internal server error.' + err.message });
  }
};


export default userTransactionController