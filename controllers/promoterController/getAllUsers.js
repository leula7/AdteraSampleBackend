import { Sequelize } from 'sequelize';
import { User, Rate, UserType, EngageUsers } from '../../models/index.js';

const getAllUsers = async (req, res) => {
  try {
    const { user_id, user_type } = req.user;

    if (user_type !== 'promoter') {
      return res.status(403).json({ message: 'Access denied. Only promoter can view all users.' });
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // get all engaged user IDs by this promoter
    const engagedUsers = await EngageUsers.findAll({
      where: { engager_user_id: user_id },
      attributes: ["engaged_user_id"],
      raw: true,
    });
    const engagedIds = engagedUsers.map(u => u.engaged_user_id);

    // find influencers excluding those already engaged
    const influencers = await User.findAll({
      where: {
        user_id: { [Sequelize.Op.notIn]: engagedIds }
      },
      attributes: {
        exclude: ['password'],
        include: [
          [Sequelize.fn('AVG', Sequelize.col('ReceivedRatings.rate')), 'rate']
        ]
      },
      include: [
        {
          model: Rate,
          as: 'ReceivedRatings',
          attributes: []
        },
        {
          model: UserType,
          as: 'UserType',
          attributes: [],
          where: { user_type: 'influencer' }
        }
      ],
      group: ['User.user_id'],
      limit,
      offset,
      subQuery: false
    });

    // format rate
    const formattedInfluencers = influencers.map(user => ({
      ...user.get(),
      rate: user.get('rate')
        ? parseFloat(user.get('rate')).toFixed(2)
        : '0.00'
    }));

    res.status(200).json(formattedInfluencers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getAllUsers;
