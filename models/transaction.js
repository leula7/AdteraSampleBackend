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
      comment: 'Connect associated with the transaction'
    },
    tx_ref: { // Added payment method
      type: DataTypes.STRING(50),
      comment: 'Payment method used'
    },
    transaction_type: { // Added payment method
      type: DataTypes.STRING(50),
      comment: 'Payment method used'
    },
    amount: { // Added payment method
      type: DataTypes.STRING(50),
      comment: 'Payment amount'
    },
     date: {
      type: DataTypes.DATE, // Changed from DATEONLY to DATE
      defaultValue: DataTypes.NOW,
      comment: 'Transaction timestamp'
    },
     status: {
      type: DataTypes.STRING(30), // Changed from DATEONLY to DATE
      defaultValue: "pending",
      comment: 'Transaction status'
    },
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
        fields: ['date'],
        name: 'idx_transaction_date'
      }
    ],
    comment: 'Table storing financial transactions'
  });
};

export default initTransaction; // Consistent export