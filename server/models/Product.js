const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Product name is required' } },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: 'Price must be a number' },
      min: { args: [0], msg: 'Price cannot be negative' },
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Quantity must be a whole number' },
      min: { args: [0], msg: 'Quantity cannot be negative' },
    },
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
