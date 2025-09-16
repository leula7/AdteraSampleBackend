import { DataTypes } from 'sequelize';

const initChat = (sequelize) => {
  return sequelize.define('Chat', {
    chat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for chat messages'
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id' },
      comment: 'User who sent the message'
    },
    reciver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id' },
      comment: 'User who received the message'
    },
    job_id: { // Only for job reference
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'jobs', key: 'job_id' },
      comment: 'Job related to the message'
    },
    engage_id: { // Added engage_id correctly
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'engage', key: 'engage_id' },
      comment: 'Engage related to the message'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Message content'
    },
    status: {
      type: DataTypes.ENUM('unread', 'read'),
      allowNull: false,
      defaultValue: 'unread',
      comment: 'Message status'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When message was sent'
    },
  }, {
    tableName: 'chats',
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    indexes: [
      { fields: ['sender_id'], name: 'idx_chat_sender' },
      { fields: ['reciver_id'], name: 'idx_chat_receiver' },
      { fields: ['status'], name: 'idx_chat_status' }
    ],
    comment: 'Table storing chat messages between users'
  });
};

export default initChat;
