require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure data + uploads directories exist
const dataDir = path.resolve(__dirname, 'data');
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// CLIENT_ORIGIN can be a single origin or a comma-separated list
// (e.g. the vanilla client on :5500 and the React client on :5173).
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images statically
app.use('/uploads', express.static(uploadsDir));

// API routes - resource-based, RESTful
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Central error handler (must be last)
app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates tables if they don't exist yet
    console.log('Database connected and synced.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
