
import  sequelize from "../../config/db.js";

const getAllFeedBacks = async (req, res) => {
  try {
    const { user_type } = req.user;
    const { type, limit, offset } = req.query;
    console.log("geting: ", req.user);
    if (user_type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only Admin can view all feedbacks.' });
    }

    if (!['influencer', 'promoter'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type parameter. Must be "influencer" or "promoter".' });
    }

    // Using raw query
    const results = await sequelize.query(`
      
      SELECT * FROM feedbacks f JOIN users_type ut ON f.user_id = ut.user_id WHERE ut.user_type = '${type}' LIMIT :limit OFFSET :offset`
    , {
      replacements: { type, limit: parseInt(limit) || 10, offset: parseInt(offset) || 0 },
      type: sequelize.QueryTypes.SELECT
    });

    

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while fetching feedbacks.' });
  }
};

export default getAllFeedBacks;