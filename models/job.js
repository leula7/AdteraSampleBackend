import { DataTypes } from 'sequelize';  // Changed to import DataTypes

const initJob = (sequelize) => {  // Renamed to initJob for consistency
  return sequelize.define('Job', {
    job_id: {
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
    required_connect: {
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
    },
    job_catagory_id: {  // Note: Keeping original spelling to match your database
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
      references: {
        model: 'job_catagories',  // Note: Keeping original spelling
        key: 'job_catagory_id'    // Note: Keeping original spelling
      }
    },
    title: {  // Fixed typo from "tilte" to "title"
      type: DataTypes.STRING(30),
      allowNull: false
    },
    job_description: {
      type: DataTypes.TEXT,  // Changed from STRING(255) to TEXT for longer descriptions
      allowNull: false
    },
    job_price: {
      type: DataTypes.INTEGER,  // Removed (11)
      allowNull: false,
      validate: {
        min: 0
      }
    },
    job_created_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
     is_premium:{
      type: DataTypes.TEXT,  // Changed from STRING(255) to TEXT for longer descriptions
      allowNull: false,
      defaultValue: false
    },
    status:{
      type: DataTypes.TEXT,  // Changed from STRING(255) to TEXT for longer descriptions
      allowNull: false
    }
  }, {
    tableName: 'jobs',
    timestamps: false,
    freezeTableName: true,  // Added to prevent pluralization
    underscored: true,     // Added for consistent naming
    // Optional: Add indexes for frequently queried fields
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['job_catagory_id']
      }
    ]
  });
};

export default initJob;  // Updated export name