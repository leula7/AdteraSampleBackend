import { Sequelize } from 'sequelize';
import { User, Rate, UserType } from '../../models/index.js';

const getAllUsers = async (req, res) => {
  try {
    const { user_id, user_type } = req.user;

    if (user_type !== 'promoter') {
      return res.status(403).json({ message: 'Access denied. Only promoter can view all users.' });
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Get users with average rating using Sequelize include
    const influencers = await User.findAll({
      attributes: {
        exclude: ['password'],
        include: [
          [Sequelize.fn('AVG', Sequelize.col('ReceivedRatings.rate')), 'rate']
        ]
      },
      include: [
        {
          model: Rate,
          as: 'ReceivedRatings', // must match the alias defined above
          attributes: []
        },
         {
            model: UserType,
            as: 'UserType',        // your UserType alias for the relation
            attributes: [],
            where: { user_type: 'influencer' }  // filter by influencer type here
          }
      ],
      group: ['User.user_id'],
      limit,
      offset,
      subQuery: false
    });


    // Format rate to 2 decimal places
    const formattedInfluencers = influencers.map(user => ({
      ...user.get(),
      rate: user.get('rate') ? parseFloat(user.get('rate')).toFixed(2) : '0.00'
    }));

    res.status(200).json(formattedInfluencers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getAllUsers;
