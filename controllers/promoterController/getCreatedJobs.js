
import { Op } from "sequelize";
import { Job } from "../../models/index.js";

const getCreatedJobs = async (req, res) => {
  try {
    const { user_id,user_type } = req.user;
    const {  limit, offset } = req.query;

    if (user_type !== 'promoter') {
      return res.status(403).json({ message: 'Access denied. Only Promoters can view all thier created jobs.' });
    }

    const results = await Job.findAll({
        where: {
          user_id: user_id,
          status: { [Op.not]: "deleted" }
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['job_created_date', 'DESC']], // Sort by createdAt descending (latest first)
      });

    
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while fetching created jobs.' });
  }
};

export default getCreatedJobs;