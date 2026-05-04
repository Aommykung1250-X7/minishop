const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// เส้นทางเดิมสำหรับ Login (ห้ามลบ)
router.post('/login', authController.login);

// เพิ่มบรรทัดใหม่สำหรับ Register (เพิ่มเข้าไปตรงนี้)
router.post('/register', authController.register);

module.exports = router;