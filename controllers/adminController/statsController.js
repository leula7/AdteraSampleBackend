import {sequelize } from '../../models/index.js';
export const getStats = async (req, res) => {
  try {
    console.log("Starting stats calculation...");
    
    const results = await Promise.all([
      // Active Influencers
      sequelize.query(
        `SELECT COUNT(*) as count FROM users u
         JOIN users_type ut ON u.user_id = ut.user_id
         WHERE ut.user_type = 'influencer' 
         AND u.account_status = 'active'`,
        { type: sequelize.QueryTypes.SELECT }
      ),
      
      // Active Companies
      sequelize.query(
        `SELECT COUNT(*) as count FROM users u
         JOIN users_type ut ON u.user_id = ut.user_id
         WHERE ut.user_type = 'promoter'
         AND u.account_status = 'active'`,
        { type: sequelize.QueryTypes.SELECT }
      ),
      
      // Connects Sold
      sequelize.query(
        `SELECT COUNT(*) as count FROM transactions`,
        { type: sequelize.QueryTypes.SELECT }
      ),
      
      // Active Jobs
      sequelize.query(
        `SELECT COUNT(*) as count FROM jobs
         WHERE status = 'active'`,
        { type: sequelize.QueryTypes.SELECT }
      )
    ]);

    // Debug log the raw results
    console.log("Raw query results:", {
      influencers: results[0],
      companies: results[1],
      connects: results[2],
      jobs: results[3]
    });

    const statsData = {
      activeInfluencers: Number(results[0][0]?.count) || 0,
      activeCompanies: Number(results[1][0]?.count) || 0,
      connectsSold: Number(results[2][0]?.count) || 0, // Changed from total to count
      jobs: Number(results[3][0]?.count) || 0
    };

    console.log("Processed stats:", statsData);

    res.json({
      success: true,
      data: statsData
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch statistics"
    });
  }
};