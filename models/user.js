import { DataTypes } from 'sequelize';

const initUser = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    connect_val: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    initial_job: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    base_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_status: {
      type: DataTypes.STRING(30),
      defaultValue: 'active'
    },
    registered_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};

export default initUser;