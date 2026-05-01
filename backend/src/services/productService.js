const fs = require('fs');
const path = require('path');

// กำหนดพาธไปยังไฟล์ JSON
const dataPath = path.join(__dirname, '../../data/products.json');

const getAllProducts = () => {
    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        throw new Error("ไม่สามารถอ่านข้อมูลสินค้าได้");
    }
};

module.exports = { getAllProducts };