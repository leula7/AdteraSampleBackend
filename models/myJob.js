import { DataTypes } from 'sequelize'; // Correct import for type definitions

const initMyJob = (sequelize) => { // Consistent initialization naming
  return sequelize.define('MyJob', {
    my_job_id: { // Changed from 'my_job' to 'my_job_id' for clarity
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for user-job associations'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'Reference to the user who owns this job'
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'job_id'
      },
      comment: 'Reference to the job being assigned'
    },
    status: {
      type: DataTypes.ENUM( // Changed to ENUM for better data integrity
        'pending',
        'in_progress',
        'completed',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Current status of the job assignment'
    },
    applied_at: { // Added timestamp for tracking
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When the job was assigned to the user'
    },
    completed_at: { // Added optional completion timestamp
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the job was marked completed'
    }
  }, {
    tableName: 'my_jobs',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent table name pluralization
    underscored: true, // Use snake_case for field names
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_my_job_user'
      },
      {
        fields: ['job_id'],
        name: 'idx_my_job_job'
      },
      {
        fields: ['status'],
        name: 'idx_my_job_status'
      }
    ],
    comment: 'Tracks jobs assigned to users and their status'
  });
};

export default initMyJob; // Consistent export naming