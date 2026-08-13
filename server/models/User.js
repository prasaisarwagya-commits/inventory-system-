const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Dedicated user/admin table, separate from business data (Products/Suppliers)
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

   isAdmin: { //
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }, 
}, {
  tableName: 'users',
  timestamps: true,
  
});

module.exports = User;
