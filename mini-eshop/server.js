const path = require('path');
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static assets from public/
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes serving simple static HTML pages from views/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// API: Products (MongoDB if available, fallback to static list)
app.get('/api/products', async (_req, res) => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.json([
      { id: 1, name: 'Wireless Mouse', price: 19.99 },
      { id: 2, name: 'Mechanical Keyboard', price: 49.99 },
      { id: 3, name: 'USB-C Hub', price: 24.99 },
      { id: 4, name: 'Noise-Canceling Headphones', price: 89.99 }
    ]);
  }
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'mini_eshop' });
    }
    const docs = await Product.find({}).lean();
    const shaped = docs.map(d => ({ id: d._id.toString(), name: d.name, price: d.price }));
    return res.json(shaped);
  } catch (err) {
    console.error('Products API error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Health endpoint for smoke tests
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Export app for testing
module.exports = app;

// Start server only if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Mini E-Shop server running on http://localhost:${PORT}`);
  });
}


