const bcrypt = require('bcryptjs');
const { User, Supplier, Product } = require('../models');

// Runs on every server start. Only creates the admin user / sample data the
// FIRST time (when the tables are empty) - safe to run on every deploy/restart
// without wiping data, unlike seed.js which is for local dev reset only.
async function ensureSeedData() {
  const userCount = await User.count();
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash,
    });
    console.log(`No users found - created admin user "${process.env.ADMIN_USERNAME || 'admin'}"`);
  }

  const supplierCount = await Supplier.count();
  if (supplierCount === 0) {
    const supplierA = await Supplier.create({
      name: 'Global Tech Supplies',
      contactEmail: 'contact@globaltech.example.com',
      phone: '+977-1-4000001',
    });
    const supplierB = await Supplier.create({
      name: 'Everest Office Depot',
      contactEmail: 'sales@everestoffice.example.com',
      phone: '+977-1-4000002',
    });

    await Product.bulkCreate([
      { name: 'Wireless Mouse', description: 'Ergonomic 2.4GHz wireless mouse', price: 12.99, quantity: 3, supplierId: supplierA.id },
      { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard, blue switches', price: 45.5, quantity: 20, supplierId: supplierA.id },
      { name: 'A4 Printer Paper (Ream)', description: '500 sheets, 80gsm', price: 4.25, quantity: 2, supplierId: supplierB.id },
      { name: 'Office Chair', description: 'Adjustable ergonomic office chair', price: 89.99, quantity: 15, supplierId: supplierB.id },
    ]);
    console.log('No suppliers found - created sample suppliers and products');
  }
}

module.exports = ensureSeedData;