require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Supplier, Product } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: drops & recreates tables

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
  await User.create({
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash,
  });
  console.log(`Admin user created -> username: ${process.env.ADMIN_USERNAME || 'admin'}`);

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
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic 2.4GHz wireless mouse',
      price: 12.99,
      quantity: 3, // low stock
      supplierId: supplierA.id,
      imagePath: null,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard, blue switches',
      price: 45.5,
      quantity: 20,
      supplierId: supplierA.id,
      imagePath: null,
    },
    {
      name: 'A4 Printer Paper (Ream)',
      description: '500 sheets, 80gsm',
      price: 4.25,
      quantity: 2, // low stock
      supplierId: supplierB.id,
      imagePath: null,
    },
    {
      name: 'Office Chair',
      description: 'Adjustable ergonomic office chair',
      price: 89.99,
      quantity: 15,
      supplierId: supplierB.id,
      imagePath: null,
    },
  ]);

  console.log('Sample suppliers and products created.');
  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
