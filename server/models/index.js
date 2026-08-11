const sequelize = require('../config/database');
const User = require('./User');
const Supplier = require('./Supplier');
const Product = require('./Product');

// A Supplier has many Products; a Product belongs to one Supplier (foreign key)
Supplier.hasMany(Product, {
  foreignKey: { name: 'supplierId', allowNull: false },
  onDelete: 'RESTRICT', // prevent deleting a supplier that still has products
});
Product.belongsTo(Supplier, {
  foreignKey: { name: 'supplierId', allowNull: false },
});

module.exports = { sequelize, User, Supplier, Product };
