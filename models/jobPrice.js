import { DataTypes } from 'sequelize';  // Correct import for type definitions

const initJobPrice = (sequelize) => {  // Consistent naming convention
  return sequelize.define('JobPrice', {
    job_price_id: {
      type: DataTypes.INTEGER,  // Removed redundant (11)
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for job price entries'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      comment: 'Reference to the user who owns this price tier'
    },
    min_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Price amount in the smallest currency unit (e.g., cents)'
    },
    max_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Price amount in the smallest currency unit (e.g., cents)'
    },
    required_connect: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Number of connects required for this job tier'
    }
  }, {
    tableName: 'job_prices',
    timestamps: false,
    freezeTableName: true,  // Prevents Sequelize from pluralizing table names
    underscored: true,      // Maintains consistent naming convention
    paranoid: false,        // Disables soft deletion
    indexes: [
      {
        fields: ['user_id'],  // Improves query performance for user lookups
        name: 'idx_job_price_user'
      }
    ],
    comment: 'Table storing different job pricing tiers and their connect requirements'
  });
};

export default initJobPrice;  // Consistent export naming