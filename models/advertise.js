import { DataTypes } from 'sequelize'; // Correct import

const initAdvertise = (sequelize) => { // Consistent naming
  return sequelize.define('Advertise', {
    advert_id: {
      type: DataTypes.INTEGER, // Removed (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for advertise'
    },
    advert_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    advert_desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: { // Added timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When advert was created'
    },
  }, {
    tableName: 'advertise',
    timestamps: false,
    freezeTableName: true, // Prevent pluralization
    underscored: true, // Consistent naming
    indexes: [
      {
        fields: ['advert_id'],
        name: 'idx_advert_id'
      },
    ],
    comment: 'Table storing adverises'
  });
};

export default initAdvertise; // Consistent export