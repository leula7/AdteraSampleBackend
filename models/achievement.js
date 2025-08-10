import { DataTypes } from 'sequelize';  // Changed from Sequelize to DataTypes

const initAchievement = (sequelize) => {  // Renamed function to initAchievement
  return sequelize.define('Achievement', {
    achievement_id: {  // Fixed spelling from "achievements" to "achievement"
      type: DataTypes.INTEGER,  // Removed (11) - Sequelize doesn't support length for INTEGER
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    achievement: {  // Fixed spelling from "achievements" to "achievement"
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'achievements',  // Fixed spelling from "achivements" to "achievements"
    timestamps: false
  });
};

export default initAchievement;  // Updated export to match new function name