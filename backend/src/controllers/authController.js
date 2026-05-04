const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
    const SECRET_KEY = "my_super_secret_key"; // ในงานจริงควรเก็บใน .env

    try {
        // [Processing] ตรวจสอบ User ผ่าน Service
        const user = await authService.authenticateUser(email, password);

        // [Gatekeeper] ถ้า Email ไม่มีในระบบ หรือรหัสผ่านผิด
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized: Email or Password incorrect'
            });
        }

        // [Response] ถ้าถูกต้อง ทำการเซ็น (Sign) JWT Token
        const token = jwt.sign(
            { id: user.username, role: 'user' }, // Payload
            SECRET_KEY, 
            { expiresIn: '1h' } // อายุ Token 1 ชั่วโมง
        );

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const result = await authService.registerUser({ name, email, password });
        if (result.success) {
            res.status(201).json({ status: 'success', message: 'สร้างบัญชีสำเร็จ' });
        } else {
            res.status(400).json({ status: 'fail', message: result.message });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { login, register };