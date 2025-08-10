import { DataTypes } from 'sequelize';

const initUserType = (sequelize) => {
  return sequelize.define('UserType', {
    user_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    user_type: {
      type: DataTypes.ENUM('influencer', 'promoter', 'admin'),
      allowNull: false
    }
  }, {
    tableName: 'users_type',
    timestamps: false
  });
};

export default initUserType;