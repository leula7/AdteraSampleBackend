import { DataTypes } from 'sequelize'; // Proper import for data types

const initFavorites = (sequelize) => {
  return sequelize.define('my_favorites', {
    my_favorite_id: {
      type: DataTypes.INTEGER, // Removed length (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Unique identifier for my_favorites'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'the user who favorited the job or the user',
    },
    fave_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'favorite user id',
    },
    fave_job_id: {
      type: DataTypes.INTEGER, // Changed to TEXT for longer messages
      allowNull: true,
      comment: 'The favorite job ID',
      validate: {
        notEmpty: true // Ensures feedback isn't empty
      }
    },
    created_at: { // Added creation timestamp
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When feedback was submitted'
    }
  }, {
    tableName: 'my_favorites',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent table name modification
    underscored: true, // Use snake_case naming
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_favorite'
      }
    ],
    comment: 'Stores user favorite submissions'
  });
};

export default initFavorites;