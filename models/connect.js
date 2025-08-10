import { DataTypes } from 'sequelize';  // Import DataTypes instead of Sequelize

const initConnect = (sequelize) => {  // Renamed to initConnect for consistency
  return sequelize.define('Connect', {
    connect_id: {
      type: DataTypes.INTEGER,  // Removed (11) - INTEGER doesn't need length in Sequelize
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
    title: {
      type: DataTypes.STRING(30),  // Kept length for STRING
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(30),  // Kept length for STRING
      allowNull: false
    },
     connect_price: {
      type: DataTypes.FLOAT,  // Removed (11)
      allowNull: false,
      validate: {
        min: 0
      }
    },
    connect_value: {
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
      validate: {
        min: 0
      }
    },
    created_at: { // Added timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'connects',
    timestamps: false,
    // Added recommended options:
    freezeTableName: true,  // Prevents Sequelize from pluralizing table names
    underscored: true      // Adds underscore style for field names (optional)
  });
};

export default initConnect;  // Consistent export naming