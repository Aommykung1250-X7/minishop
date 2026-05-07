const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const db = require('../database');

// เส้นทางเดิมสำหรับ Login (ห้ามลบ)
router.post('/login', authController.login);

// เพิ่มบรรทัดใหม่สำหรับ Register (เพิ่มเข้าไปตรงนี้)
router.post('/register', authController.register);


router.post('/checkout', async (req, res) => {
    try {
        const { email, cart, cardNumber, shippingAddress } = req.body;
        let errors = [];

        // 1. ตรวจสอบ Cart Items
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            errors.push("ตะกร้าสินค้าว่างเปล่า");
        }

        // 2. ตรวจสอบ Email ด้วย Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push("รูปแบบอีเมลไม่ถูกต้อง");
        }

        // 3. ตรวจสอบเลขบัตรเครดิต 16 หลัก
        const cardRegex = /^\d{16}$/;
        if (!cardNumber || !cardRegex.test(cardNumber)) {
            errors.push("เลขบัตรเครดิตต้องเป็นตัวเลข 16 หลัก");
        }

        // หากมี Error ในการ Validate ส่งกลับทันทีพร้อมสถานะ 400
        if (errors.length > 0) {
            return res.status(400).json({ 
                status: 'fail', 
                message: errors.join(", ") 
            });
        }

        // 4. คำนวณราคาทั้งหมด (Total)[cite: 1]
        // หมายเหตุ: ถ้าราคาใน cart ของคุณมี '$' ให้จัดการเอาออกก่อนคำนวณ[cite: 1]
        const total = cart.reduce((sum, item) => {
            const price = typeof item.price === 'string' 
                ? parseFloat(item.price.replace('$', '')) 
                : item.price;
            return sum + (price * item.quantity);
        }, 0);

        // 5. ลองบันทึก Order (Try...Catch ภายใน)[cite: 1]
        try {
            const { user_id, cart } = req.body; // รับข้อมูลที่ส่งมาจาก checkout_2.js

            console.log("ได้รับข้อมูลการสั่งซื้อ:", req.body); // เช็กใน Terminal ว่าข้อมูลมาไหม
            const sql = `INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)`;

            // ใช้ db.serialize เพื่อให้บันทึกสินค้าทีละชิ้นตามลำดับ
            db.serialize(() => {
                cart.forEach(item => {
                    db.run(sql, [
                        user_id || 1, 
                        item.product_id, 
                        item.quantity, 
                        item.total_price
                    ], function(err) {
                        if (err) {
                            console.error("SQL Error:", err.message);
                        } else {
                            console.log(`บันทึกสินค้า ID ${item.product_id} สำเร็จ (Row ID: ${this.lastID})`);
                        }
                    });
                });
            });          // โค้ดสำหรับบันทึกลงไฟล์ users.json หรือ database ของคุณจะอยู่ตรงนี้[cite: 1]
            // เช่น: await saveOrderToDB({ email, cart, total, shippingAddress });
            
            res.status(200).json({
                status: 'success',
                message: "สั่งซื้อสินค้าสำเร็จ!",
                orderTotal: total.toFixed(2)
            });
        } catch (saveError) {
            throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูลคำสั่งซื้อ");
        }

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;

