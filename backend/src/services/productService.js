const fs = require('fs').promises;
const path = require('path');
const dataPath = path.join(__dirname, '../../data/products.json');

// [Processing] ฟังก์ชันรื้อตู้เย็น (JSON) เพื่อหาของตามสั่ง
const filterProductsByCategory = async (category) => {
    const rawData = await fs.readFile(dataPath, 'utf8');
    const allProducts = JSON.parse(rawData);

    // ทำการร่อน (Filter) โดยใช้ .toLowerCase() ป้องกันปัญหาตัวพิมพ์เล็ก-ใหญ่
    return allProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
    );
};

const getAllProducts = async () => {
    const rawData = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(rawData);
};

module.exports = { filterProductsByCategory, getAllProducts };