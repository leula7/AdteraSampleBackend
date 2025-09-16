import { Op } from "sequelize";
import { Transaction } from "../../models/index.js";

export const transactionController = async (req, res) => {
  try {
    const { payment_method, connect_id, status, limit, page, startDate, endDate } = req.query.filters || {};
    const { user_type } = req.user;

    // Authorization check
    if (user_type !== "admin") {
      return res.status(401).json({ message: "Unauthorized user type" });
    }

    // Build base query
    const queryOptions = {
      where: {},
      limit: Number(limit) || 10,
      offset: ((Number(page) || 1) - 1) * (Number(limit) || 10),
    };

    // Connect ID filter
    if (connect_id && connect_id !== "all") {
      queryOptions.where.connect_id = connect_id;
    }

    // Payment method filter
    if (payment_method && payment_method !== "all") {
      queryOptions.where.payment_method = payment_method;
    }

    // Status filter
    if (status && status !== "all") {
      queryOptions.where.status = status;
    }

    // Date range filter
    if (startDate && endDate) {
      queryOptions.where.date = {
        [Op.between]: [
          new Date(startDate).setHours(0, 0, 0, 0),
          new Date(endDate).setHours(23, 59, 59, 999),
        ],
      };
    }

    // Count total transactions with filters (for correct pagination)
    const totalTransaction = await Transaction.count({ where: queryOptions.where });

    // Fetch filtered transactions
    const transactions = await Transaction.findAll(queryOptions);

    res.status(200).json({
      totalTransaction,
      totalPages: Math.ceil(totalTransaction / queryOptions.limit),
      transaction: transactions,
    });
  } catch (error) {
    console.error("Error in get All Transaction:", error);
    res.status(500).json({ error: error.message });
  }
};
