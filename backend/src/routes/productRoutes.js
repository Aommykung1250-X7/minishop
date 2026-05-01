const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// กำหนดเส้นทาง GET /api/products
router.get('/', productController.getProducts);

module.exports = router;