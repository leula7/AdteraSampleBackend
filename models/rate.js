import { DataTypes } from 'sequelize';  // Correct import statement

const initRate = (sequelize) => {  // Consistent naming convention
  return sequelize.define('Rate', {
    rate_id: {
      type: DataTypes.INTEGER,  // Removed (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for rating records'
    },
    rated_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User being rated'
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'job_id'
      },
      comment: 'Job associated with the rating'
    },
    rated_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who submitted the rating'
    },
    comment: {
      type: DataTypes.TEXT,  // Changed to TEXT for longer comments
      defaultValue: 'No comment provided',
      comment: 'Optional feedback comment'
    },
    rate: {
      type: DataTypes.DECIMAL(4,3),
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      },
      comment: 'Rating value (1-5 scale)'
    },
    rated_date: {  // Added timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When the rating was submitted'
    }
  }, {
    tableName: 'rates',
    timestamps: false,  // Disable automatic timestamps
    freezeTableName: true,  // Prevent table name pluralization
    underscored: true,  // Use snake_case for field names
    indexes: [
      {
        fields: ['rated_user_id'],
        name: 'idx_rate_rated_user'
      },
      {
        fields: ['rated_by_user_id'],
        name: 'idx_rate_rated_by_user'
      },
      {
        fields: ['job_id'],
        name: 'idx_rate_job'
      }
    ],
    comment: 'Table storing user ratings and feedback'
  });
};

export default initRate;  // Consistent export naming