import sequelize from "../../config/db.js";

export const updateUserStatus = async (req, res) => {
  try {
    const { user_type } = req.user;
    const { userId, status, userType } = req.body;

    if (user_type !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Only Admin can update user status.' 
      });
    }

    await sequelize.query(
      `UPDATE users SET account_status = :status WHERE user_id = :userId`,
      {
        replacements: { status, userId },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    if (userType === 'companies') {
      // Company-specific updates if needed
    }

    res.status(200).json({ 
      success: true,
      message: 'User status updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error while updating user status.' 
    });
  }
};
//console.log("messajjjaf", getUsers);

export const getUsers = async (req, res) => {
  try {
    const { type } = req.query;
    
    // Base query with JOIN to users_type table
    let query = `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.phone_number,
        u.bio,
        u.account_status,
        u.profile_picture,
        ut.user_type
      FROM users u
      JOIN users_type ut ON u.user_id = ut.user_id
    `;

    const replacements = {};

    // Add WHERE clause if type is specified
    if (type && ['influencer', 'promoter'].includes(type)) {
      query += ' WHERE ut.user_type = :type';
      replacements.type = type;
    }

    query += ' ORDER BY u.user_id';

    const users = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    res.json({ 
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};
// export const getUsers = async (req, res) => {
//   try {
//     const users = await sequelize.query(
  
//       "SELECT * FROM users", //WHERE account_status = 'active'",
//       { type: sequelize.QueryTypes.SELECT }
//     );
//     res.json({ success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// Option 1: Named exports (recommended)
export default {
  updateUserStatus,
  getUsers
};

// OR Option 2: Just use the named export directly
// and import it as { updateUserStatus } in routes.js