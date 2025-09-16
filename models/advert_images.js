import { DataTypes } from 'sequelize';  // Changed from importing Sequelize to DataTypes

const initAdvertImages = (sequelize) => {  // Changed function name to initSocialMedia
  return sequelize.define('AdvertImages', {
    advert_image_id: {
      type: DataTypes.INTEGER,  // Removed (11) - Sequelize doesn't support length for INTEGER
      primaryKey: true,
      autoIncrement: true
    },
    advert_id: {
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
      references: {
        model: 'advertise',
        key: 'advert_id'
      }
    },
    advert_image: {
      type: DataTypes.BLOB('long'),
      allowNull: false
    }
  }, {
    tableName: 'advert_images',
    timestamps: false
  });
};

export default initAdvertImages;