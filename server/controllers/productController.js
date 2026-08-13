// const { validationResult } = require('express-validator');
// const { Op } = require('sequelize');
// const fs = require('fs');
// const path = require('path');
// const { Product, Supplier } = require('../models');

// const LOW_STOCK_THRESHOLD = 5;

// function deleteImageFile(imagePath) {
//   if (!imagePath) return;
//   const fullPath = path.resolve(__dirname, '..', 'uploads', path.basename(imagePath));
//   fs.unlink(fullPath, () => {}); // best-effort cleanup, ignore errors
// }

// // GET /api/products?search=&supplierId=
// async function getAllProducts(req, res, next) {
//   try {
//     const { search, supplierId } = req.query;
//     const where = {};

//     if (search) {
//       where.name = { [Op.like]: `%${search}%` };
//     }
//     if (supplierId) {
//       where.supplierId = supplierId;
//     }

//     const products = await Product.findAll({
//       where,
//       include: [{ model: Supplier, attributes: ['id', 'name'] }],
//       order: [['name', 'ASC']],
//     });

//     const withFlags = products.map((p) => ({
//       ...p.toJSON(),
//       lowStock: p.quantity < LOW_STOCK_THRESHOLD,
//     }));

//     res.json(withFlags);
//   } catch (err) {
//     next(err);
//   }
// }

// // GET /api/products/:id
// async function getProductById(req, res, next) {
//   try {
//     const product = await Product.findByPk(req.params.id, {
//       include: [{ model: Supplier, attributes: ['id', 'name', 'contactEmail', 'phone'] }],
//     });
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.json({ ...product.toJSON(), lowStock: product.quantity < LOW_STOCK_THRESHOLD });
//   } catch (err) {
//     next(err);
//   }
// }

// // POST /api/products
// async function createProduct(req, res, next) {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       if (req.file) deleteImageFile(req.file.filename);
//       return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
//     }

//     const { name, description, price, quantity, supplierId } = req.body;

//     const supplier = await Supplier.findByPk(supplierId);
//     if (!supplier) {
//       if (req.file) deleteImageFile(req.file.filename);
//       return res.status(400).json({ message: 'Selected supplier does not exist' });
//     }

//     const product = await Product.create({
//       name,
//       description,
//       price,
//       quantity,
//       supplierId,
//       imagePath: req.file ? `/uploads/${req.file.filename}` : null,
//     });

//     const withSupplier = await Product.findByPk(product.id, { include: [Supplier] });
//     res.status(201).json(withSupplier);
//   } catch (err) {
//     if (req.file) deleteImageFile(req.file.filename);
//     next(err);
//   }
// }

// // PUT /api/products/:id
// async function updateProduct(req, res, next) {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       if (req.file) deleteImageFile(req.file.filename);
//       return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
//     }

//     const product = await Product.findByPk(req.params.id);
//     if (!product) {
//       if (req.file) deleteImageFile(req.file.filename);
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const { name, description, price, quantity, supplierId } = req.body;

//     if (supplierId) {
//       const supplier = await Supplier.findByPk(supplierId);
//       if (!supplier) {
//         if (req.file) deleteImageFile(req.file.filename);
//         return res.status(400).json({ message: 'Selected supplier does not exist' });
//       }
//     }

//     const oldImage = product.imagePath;
//     await product.update({
//       name,
//       description,
//       price,
//       quantity,
//       supplierId,
//       ...(req.file ? { imagePath: `/uploads/${req.file.filename}` } : {}),
//     });

//     if (req.file && oldImage) deleteImageFile(oldImage);

//     const withSupplier = await Product.findByPk(product.id, { include: [Supplier] });
//     res.json(withSupplier);
//   } catch (err) {
//     if (req.file) deleteImageFile(req.file.filename);
//     next(err);
//   }
// }

// // DELETE /api/products/:id
// async function deleteProduct(req, res, next) {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     deleteImageFile(product.imagePath);
//     await product.destroy();
//     res.json({ message: 'Product deleted successfully' });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };



const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Product, Supplier } = require('../models');

const LOW_STOCK_THRESHOLD = 5;

function deleteImageFile(imagePath) {
  if (!imagePath) return;
  const fullPath = path.resolve(__dirname, '..', 'uploads', path.basename(imagePath));
  fs.unlink(fullPath, () => {});
}

async function getAllProducts(req, res, next) {
  try {
    const { search, supplierId } = req.query;
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (supplierId) where.supplierId = supplierId;
    if (!req.user.isAdmin) where.createdBy = req.user.id;

    const products = await Product.findAll({
      where,
      include: [{ model: Supplier, attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
    });
    const withFlags = products.map((p) => ({ ...p.toJSON(), lowStock: p.quantity < LOW_STOCK_THRESHOLD }));
    res.json(withFlags);
  } catch (err) { next(err); }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, attributes: ['id', 'name', 'contactEmail', 'phone'] }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.user.isAdmin && product.createdBy !== req.user.id) return res.status(404).json({ message: 'Product not found' });

    res.json({ ...product.toJSON(), lowStock: product.quantity < LOW_STOCK_THRESHOLD });
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const { name, description, price, quantity, supplierId } = req.body;

    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: 'Selected supplier does not exist' });
    }
    if (!req.user.isAdmin && supplier.createdBy !== req.user.id) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: 'Selected supplier does not exist' });
    }

    const product = await Product.create({
      name, description, price, quantity, supplierId,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: req.user.id,
    });

    const withSupplier = await Product.findByPk(product.id, { include: [Supplier] });
    res.status(201).json(withSupplier);
  } catch (err) {
    if (req.file) deleteImageFile(req.file.filename);
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ message: 'Product not found' });
    }
    if (!req.user.isAdmin && product.createdBy !== req.user.id) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, quantity, supplierId } = req.body;
    if (supplierId) {
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        if (req.file) deleteImageFile(req.file.filename);
        return res.status(400).json({ message: 'Selected supplier does not exist' });
      }
    }

    const oldImage = product.imagePath;
    await product.update({
      name, description, price, quantity, supplierId,
      ...(req.file ? { imagePath: `/uploads/${req.file.filename}` } : {}),
    });
    if (req.file && oldImage) deleteImageFile(oldImage);

    const withSupplier = await Product.findByPk(product.id, { include: [Supplier] });
    res.json(withSupplier);
  } catch (err) {
    if (req.file) deleteImageFile(req.file.filename);
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.user.isAdmin && product.createdBy !== req.user.id) return res.status(404).json({ message: 'Product not found' });

    deleteImageFile(product.imagePath);
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };