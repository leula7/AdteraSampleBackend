import { DataTypes } from 'sequelize'; // Correct import

const initChat = (sequelize) => { // Consistent naming
  return sequelize.define('Chat', {
    chat_id: {
      type: DataTypes.INTEGER, // Removed (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for chat messages'
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who sent the message'
    },
    reciver_id: { // Fixed spelling from 'reciver_i'
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'User who received the message'
    },
    message: {
      type: DataTypes.TEXT, // Changed from STRING(255) to TEXT
      allowNull: false,
      comment: 'Message content'
    },
    status: {
      type: DataTypes.ENUM( // Changed to ENUM for better integrity
        'unread',
        'read',
        'delivered',
        'deleted'
      ),
      allowNull: false,
      defaultValue: 'unread',
      comment: 'Message status'
    },
    created_at: { // Added timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When message was sent'
    },
  }, {
    tableName: 'chats',
    timestamps: false,
    freezeTableName: true, // Prevent pluralization
    underscored: true, // Consistent naming
    indexes: [
      {
        fields: ['sender_id'],
        name: 'idx_chat_sender'
      },
      {
        fields: ['receiver_id'],
        name: 'idx_chat_receiver'
      },
      {
        fields: ['status'],
        name: 'idx_chat_status'
      }
    ],
    comment: 'Table storing chat messages between users'
  });
};

export default initChat; // Consistent export