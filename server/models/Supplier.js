const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Supplier name is required' } },
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Contact email is required' },
      isEmail: { msg: 'Contact email must be a valid email address' },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Phone number is required' } },
  },
}, {
  tableName: 'suppliers',
  timestamps: true,
});

module.exports = Supplier;
