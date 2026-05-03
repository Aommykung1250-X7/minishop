const productService = require('../services/productService');

const getFilteredProducts = async (req, res) => {
    // [Request] เปิดซองจดหมายเพื่อดูค่า category
    const { category } = req.query;

    // [Processing] Gatekeeper logic: ตรวจสอบว่าส่งหมวดหมู่มาไหม
    if (!category) {
        return res.status(400).json({
            status: 'fail',
            message: 'กรุณาระบุหมวดหมู่ที่ต้องการ'
        });
    }

    try {
        // [Processing] ดึงข้อมูลที่ร่อนแล้วจาก Service
        const products = await productService.filterProductsByCategory(category);

        // [Response] ส่ง Package กลับไปพร้อม Status Success
        res.status(200).json({
            status: 'success',
            data: products
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// เพิ่มฟังก์ชันนี้เข้าไป
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(); // เรียก service ตัวเดิม
        res.status(200).json({
            status: 'success',
            data: products
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// อย่าลืม Export เพิ่มด้วย
module.exports = { getFilteredProducts, getAllProducts };