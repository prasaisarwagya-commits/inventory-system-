const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be a positive whole number'),
  body('supplierId').notEmpty().withMessage('Supplier is required'),
];

// All product routes require a logged-in admin
router.use(requireAuth);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), productValidation, createProduct);
router.put('/:id', upload.single('image'), productValidation, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
