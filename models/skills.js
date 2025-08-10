import { DataTypes } from 'sequelize';  // Changed from Sequelize to DataTypes

const initSkill = (sequelize) => {  // Renamed function to initExperience
  return sequelize.define('Experience', {
    skill_id: {
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
    skill: {
      type: DataTypes.STRING(30),  // Kept length for STRING
      allowNull: false
    }
  }, {
    tableName: 'skills',
    timestamps: false
  });
};

export default initSkill;  // Updated export to match new function name