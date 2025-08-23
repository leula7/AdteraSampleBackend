import { DataTypes } from 'sequelize'; // Correct import

const initTransaction = (sequelize) => { // Consistent naming
  return sequelize.define('Transaction', {
    transaction_id: {
      type: DataTypes.INTEGER, // Removed (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for transactions'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User associated with the transaction'
    },
    connect_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'connects',
        key: 'connect_id'
      },
      comment: 'Connects associated with the transaction'
    },
    tx_ref: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'transacation references'
    },
    amount: { // Added amount field
      type: DataTypes.DECIMAL(10, 2), // For monetary values
      allowNull: false,
      comment: 'Transaction amount'
    },
    transaction_type: { // Added type field
      type: DataTypes.ENUM(
        'payment',
        'refund',
        'withdrawal',
        'deposit'
      ),
      allowNull: false,
      comment: 'Type of transaction'
    },
    status: { // Added status field
      type: DataTypes.ENUM(
        'pending',
        'completed',
        'failed',
        'cancelled'
      ),
      defaultValue: 'pending',
      comment: 'Transaction status'
    },
    date: {
      type: DataTypes.DATE, // Changed from DATEONLY to DATE
      defaultValue: DataTypes.NOW,
      comment: 'Transaction timestamp'
    },
    status: {
      type: DataTypes.TEXT,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'transactions',
    timestamps: false,
    freezeTableName: true, // Prevent pluralization
    underscored: true, // Consistent naming
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_transaction_user'
      },
      {
        fields: ['connect_id'],
        name: 'idx_transaction_job'
      },
      {
        fields: ['date'],
        name: 'idx_transaction_date'
      },
      {
        fields: ['status'],
        name: 'idx_transaction_status'
      }
    ],
    comment: 'Table storing financial transactions'
  });
};

export default initTransaction; // Consistent export