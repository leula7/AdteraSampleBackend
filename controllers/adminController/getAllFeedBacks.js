
import  sequelize from "../../config/db.js";
import { Feedback, User, UserType } from "../../models/index.js";

const getAllFeedBacks = async (req, res) => {
  try {
    const { user_type } = "admin";
    const { type, limit, offset,startDate, endDate } = req.query;
    console.log("my limit ",startDate)

    if((type !== "all") && (!startDate || !endDate)){
      console.log("Fetching feedbacks with type filter no date:", type);
      const results = await sequelize.query(`
      
      SELECT * FROM feedbacks f JOIN users_type ut ON f.user_id = ut.user_id WHERE ut.user_type = '${type}' and f.visibility = 0  LIMIT :limit OFFSET :offset`
    , {
      replacements: { type, limit: parseInt(limit) || 10, offset: parseInt(offset) || 0 },
      type: sequelize.QueryTypes.SELECT
    });
    return res.status(200).json(results);
    }

    if(type === 'all') {
      console.log("Fetching all feedbacks without filters");
   const results = await sequelize.query(`
      
      SELECT * FROM feedbacks f JOIN users_type ut ON f.user_id = ut.user_id WHERE f.visibility = 0 LIMIT :limit OFFSET :offset`
    , {
      replacements: { type, limit: parseInt(limit) || 10, offset: parseInt(offset) || 0 },
      type: sequelize.QueryTypes.SELECT
    });


      return res.status(200).json(results);
    }

     if(type === 'all' && !startDate || !endDate) {
      console.log("Fetching all data feedbacks without filters no date");
      const response = await Feedback.findAll({limit: Number(limit),offset: Number(offset) ,order: [['created_at', 'DESC']]});
      return res.status(200).json(response);
    }
    
    console.log("geting: ", req.query);
    if (user_type === 'admin') {
      return res.status(403).json({ message: 'Access denied. Only Admin can view all feedbacks.' });
    }

    if (!['influencer', 'promoter'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type parameter. Must be "influencer" or "promoter".' });
    }

    // Using raw query
    const results = await sequelize.query(`
      
      SELECT * FROM feedbacks f JOIN users_type ut ON f.user_id = ut.user_id WHERE ut.user_type = '${type}' and f.visibility = 0 and created_at between '${startDate}' and '${endDate}' LIMIT :limit OFFSET :offset`
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