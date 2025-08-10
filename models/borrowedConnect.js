import { DataTypes } from 'sequelize'; // Correct import for type definitions

const initBorrowedConnect = (sequelize) => { // Consistent naming convention
  return sequelize.define('BorrowedConnect', {
    borrowed_connect_id: {
      type: DataTypes.INTEGER, // Removed redundant (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for borrowed connects tracking'
    },
    borrowed_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who borrowed the connects'
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'job_id'
      },
      comment: 'Job associated with the borrowed connects'
    },
    borrowed_val: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1 // Changed from 0 to 1 since you can't borrow 0 connects
      },
      comment: 'Number of connects borrowed'
    },
    borrowed_at: { // Added timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When the connects were borrowed'
    },
    repayment_due_date: { // Added repayment tracking
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Optional due date for connect repayment'
    },
    is_repaid: { // Added repayment status
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether the connects have been repaid'
    }
  }, {
    tableName: 'borrowed_connects',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent table name pluralization
    underscored: true, // Use snake_case for field names
    indexes: [
      {
        fields: ['borrowed_user_id'],
        name: 'idx_borrowed_connect_user'
      },
      {
        fields: ['job_id'],
        name: 'idx_borrowed_connect_job'
      },
      {
        fields: ['is_repaid'],
        name: 'idx_borrowed_connect_repayment_status'
      }
    ],
    comment: 'Tracks connects borrowed between users for jobs'
  });
};

export default initBorrowedConnect; // Consistent export naming