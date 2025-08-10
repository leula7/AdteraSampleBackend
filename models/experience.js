import { DataTypes } from 'sequelize';  // Changed from Sequelize to DataTypes

const initExperience = (sequelize) => {  // Renamed function to initExperience
  return sequelize.define('Experience', {
    experience_id: {
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
    site: {
      type: DataTypes.STRING(30),  // Kept length for STRING
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(30),  // Kept length for STRING
      allowNull: false
    },
    experience_link: {
      type: DataTypes.STRING(255),  // Kept length for STRING
      allowNull: false,
      validate: {
        isUrl: true
      }
    }
  }, {
    tableName: 'experiences',
    timestamps: false
  });
};

export default initExperience;  // Updated export to match new function name