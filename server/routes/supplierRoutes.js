const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

const supplierValidation = [
  body('name').trim().notEmpty().withMessage('Supplier name is required'),
  body('contactEmail').trim().isEmail().withMessage('A valid contact email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

// All supplier routes require a logged-in admin
router.use(requireAuth);

router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.post('/', supplierValidation, createSupplier);
router.put('/:id', supplierValidation, updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;
