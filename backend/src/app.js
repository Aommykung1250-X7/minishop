const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// 1. นำเข้าการเชื่อมต่อฐานข้อมูลจากไฟล์ database.js
// เพื่อให้แน่ใจว่าไฟล์ store.db ถูกสร้างขึ้นและพร้อมใช้งานเมื่อรัน Server
const db = require('./database'); 

const port = 3000;

app.use(cors());
app.use(express.json());

// 2. ใช้งาน Routes[cite: 3]
app.use('/api/products', productRoutes);
app.use('/api', authRoutes);

// เพิ่มเติม: คุณสามารถส่งตัวแปร db เข้าไปใน Routes ได้หากจำเป็น
// หรือให้ในไฟล์ Route (เช่น authRoutes.js) require('./database') โดยตรงก็ได้ครับ

app.listen(port, () => {
    console.log(`Architecture Server running at http://localhost:${port}`);
    console.log(`Database store.db is connected and ready.[cite: 1]`);
});