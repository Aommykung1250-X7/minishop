const productService = require('../services/productService');

const getProducts = (req, res) => {
    console.log("มีคนเรียก API เข้ามาแล้ว!"); // ดูใน Terminal ว่าข้อความนี้ขึ้นไหม
    try {
        const products = productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts };
