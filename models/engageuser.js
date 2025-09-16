import { DataTypes } from 'sequelize'; // Proper import for data types

const initEngageUser = (sequelize) => {
  return sequelize.define('Engage', {
    engage_id: {
      type: DataTypes.INTEGER, // Removed length (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Unique identifier for feedback'
    },
    engager_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who engage the user'
    },
    engaged_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who Engaged by user'
    },
    engage_message: {
      type: DataTypes.TEXT, // Changed to TEXT for longer messages
      allowNull: false,
      comment: 'The engagment content',
      validate: {
        notEmpty: true // Ensures feedback isn't empty
      }
    },
    status: {
      type: DataTypes.TEXT, // Changed to TEXT for longer messages
      allowNull: false,
      comment: 'The engagement sattus',
      defaultValue: "pending",
      validate: {
        notEmpty: true // Ensures feedback isn't empty
      }
    },
    created_at: { // Added creation timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When engaged was submitted'
    }
  }, {
    tableName: 'engage',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent table name modification
    underscored: true, // Use snake_case naming
    indexes: [
      {
        fields: ['engager_user_id'],
        name: 'idx_engage_user'
      }
    ],
    comment: 'Stores user engagement submissions'
  });
};

export default initEngageUser;