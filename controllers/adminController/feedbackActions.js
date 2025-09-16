// controllers/adminController/feedbackActions.js
import sequelize from "../../config/db.js";
import { Feedback } from '../../models/index.js';

export const markFeedbackSeen = async (req, res) => {
  try {
    const { user_type } = req.user || {};
    const {description,feedback_id} = req.body.data || {};

    if (user_type === "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const response = await Feedback.update(
      { visibility: 1, feedback_description: description },
      { where: { feedback_id } }
    );
    console.log("Response from Feedback.update:", response);
    if (response[0] === 0) {
      return res.status(404).json({ message: "Feedback not found or already seen." });
    }
    res.status(200).json({ message: "Feedback marked as seen." });
  } catch (err) {
    console.error("markFeedbackSeen error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { user_type } = req.user || {};
    if (user_type !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const { id } = req.params;
    const sql = `DELETE FROM feedbacks WHERE feedback_id = :id`;
    await sequelize.query(sql, {
      replacements: { id: parseInt(id, 10) },
      type: sequelize.QueryTypes.DELETE
    });

    return res.status(200).json({ message: "Feedback deleted." });
  } catch (err) {
    console.error("deleteFeedback error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
