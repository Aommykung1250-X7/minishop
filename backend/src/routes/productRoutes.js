const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// เพิ่มบรรทัดนี้ลงไป
router.get('/', productController.getAllProducts); 
router.get('/filter', productController.getFilteredProducts);

module.exports = router;