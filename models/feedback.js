import { DataTypes } from 'sequelize'; // Proper import for data types

const initFeedback = (sequelize) => {
  return sequelize.define('Feedback', {
    feedback_id: {
      type: DataTypes.INTEGER, // Removed length (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Unique identifier for feedback'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who submitted the feedback'
    },
    feedback: {
      type: DataTypes.TEXT, // Changed to TEXT for longer messages
      allowNull: false,
      comment: 'The feedback content',
      validate: {
        notEmpty: true // Ensures feedback isn't empty
      },
    },
    created_at: { // Added creation timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When feedback was submitted'
    }
  }, {
    tableName: 'feedbacks',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent table name modification
    underscored: true, // Use snake_case naming
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_feedback_user'
      }
    ],
    comment: 'Stores user feedback submissions'
  });
};

export default initFeedback;