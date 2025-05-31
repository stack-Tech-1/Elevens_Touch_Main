const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
// This code sets up routes for fetching all products and a specific product by ID in a Node.js application using Express.js.