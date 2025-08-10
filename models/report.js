import { DataTypes } from 'sequelize'; // Correct import

const initReport = (sequelize) => { // Consistent naming
  return sequelize.define('Report', {
    report_id: {
      type: DataTypes.INTEGER, // Removed (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for reports'
    },
    reporter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who made the report'
    },
    reported_user_id: { // Added field for who is being reported
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if reporting content/system
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User being reported (if applicable)'
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who made the report'
    },
    report_type: { // Added basic categorization
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'user'
    },
    detail: {
      type: DataTypes.TEXT, // Changed to TEXT for longer reports
      allowNull: false,
      validate: {
        notEmpty: true // Ensures message isn't empty
      }
    },
    status: { // Added basic status tracking
      type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
      defaultValue: 'pending'
    },
    created_at: { // Added timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reports',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent table name pluralization
    underscored: true, // Consistent naming convention
    indexes: [
      {
        fields: ['reporter_id'],
        name: 'idx_report_reporter'
      },
      {
        fields: ['reported_user_id'],
        name: 'idx_report_reported_user'
      },
      {
        fields: ['status'],
        name: 'idx_report_status'
      }
    ],
    comment: 'Table storing user reports and complaints'
  });
};

export default initReport;