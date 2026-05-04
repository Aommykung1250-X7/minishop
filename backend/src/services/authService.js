const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto'); // ใช้สำหรับ MD5

const userPath = path.join(__dirname, '../../data/users.json');
const dataPath = path.join(__dirname, '../../data/users.json');

const authenticateUser = async (email, password) => {
    // 1. อ่านข้อมูลผู้ใช้ทั้งหมด
    const rawData = await fs.readFile(userPath, 'utf8');
    const users = JSON.parse(rawData);

    // 2. ค้นหาผู้ใช้ด้วย Email
    const user = users.find(u => u.username === email);
    
    // [Security Note] ถ้าไม่เจอ User ให้ส่งค่ากลับไปเพื่อให้ Controller ตอบ 401
    if (!user) return null;

    // 3. Hash รหัสผ่านที่ส่งมาด้วย MD5 เพื่อเทียบกับในฐานข้อมูล
    const hash = crypto.createHash('md5').update(password).digest('hex');

    // 4. ตรวจสอบว่าตรงกันหรือไม่
    if (hash === user.password_hash) {
        return user; // Match!
    }

    return null; // Password ไม่ตรง
};

const registerUser = async (userData) => {
    const rawData = await fs.readFile(dataPath, 'utf8');
    const users = JSON.parse(rawData);

    // [Processing] ตรวจสอบว่ามี Username (Email) อยู่ในระบบหรือยัง
    const existingUser = users.find(u => u.username === userData.email);
    if (existingUser) return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };

    // [Processing] สร้างข้อมูลผู้ใช้ใหม่และ Hash รหัสผ่านด้วย MD5
    const newUser = {
        username: userData.email,
        password_hash: crypto.createHash('md5').update(userData.password).digest('hex'),
        first_name: userData.name,
        registration_date: new Date().toISOString().split('T')[0] // 2026-05-04
    };

    users.push(newUser);
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2)); // บันทึกลง user.json
    return { success: true };
};

module.exports = { authenticateUser, registerUser };