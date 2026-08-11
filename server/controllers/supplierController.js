const { validationResult } = require('express-validator');
const { Supplier, Product } = require('../models');

// GET /api/suppliers
async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.findAll({ order: [['name', 'ASC']] });
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
}

// GET /api/suppliers/:id
async function getSupplierById(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    next(err);
  }
}

// POST /api/suppliers
async function createSupplier(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const { name, contactEmail, phone } = req.body;
    const supplier = await Supplier.create({ name, contactEmail, phone });
    res.status(201).json(supplier);
  } catch (err) {
    next(err);
  }
}

// PUT /api/suppliers/:id
async function updateSupplier(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const { name, contactEmail, phone } = req.body;
    await supplier.update({ name, contactEmail, phone });
    res.json(supplier);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/suppliers/:id
async function deleteSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const productCount = await Product.count({ where: { supplierId: supplier.id } });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete supplier: ${productCount} product(s) are still linked to this supplier. Reassign or delete those products first.`,
      });
    }

    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
