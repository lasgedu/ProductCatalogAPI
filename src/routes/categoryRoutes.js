const express = require('express');
const router = express.Router();

router.post('/categories', (req, res) => {
  res.status(201).json({ message: 'Category created' });
});

module.exports = router;
// server.js
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api', categoryRoutes); // Mounts under /api