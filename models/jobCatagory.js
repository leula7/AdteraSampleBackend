import { DataTypes } from 'sequelize';  // Changed to import DataTypes

const initJobCategory = (sequelize) => {  // Renamed to initJobCategory
  return sequelize.define('JobCategory', {
    job_catagory_id: {  // Keeping original spelling
      type: DataTypes.INTEGER,  // Removed (11)
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
    job_catagory: {  // Keeping original spelling
      type: DataTypes.STRING(30),
      allowNull: false
    },
    job_catagory_descripiton: {  // Keeping original spelling
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'job_catagories',  // Keeping original spelling
    timestamps: false,
    freezeTableName: true,  // Added to prevent pluralization
    underscored: true  // Optional: for snake_case column names
  });
};

export default initJobCategory;  // Updated export name