import { DataTypes } from 'sequelize';  // Changed from importing Sequelize to DataTypes

const initSocialMedia = (sequelize) => {  // Changed function name to initSocialMedia
  return sequelize.define('SocialMedia', {
    social_media_id: {
      type: DataTypes.INTEGER,  // Removed (11) - Sequelize doesn't support length for INTEGER
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    social_media_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    social_link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isUrl: true
      }
    }
  }, {
    tableName: 'social_media',
    timestamps: false
  });
};

export default initSocialMedia;  // Changed to export initSocialMedia