const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// กำหนดที่อยู่ไฟล์ ให้สร้างไว้ในโฟลเดอร์ปัจจุบันที่ไฟล์นี้อยู่
const dbPath = path.join(__dirname, 'store.db');

// คำสั่งนี้แหละครับที่จะเป็นคนสร้างไฟล์ store.db ให้เรา
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error("เกิดข้อผิดพลาด:", err.message);
    }
    console.log("--- สร้างไฟล์ store.db และเชื่อมต่อสำเร็จ! ---");
});

// สร้างตาราง orders รอไว้เลย
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        total_price REAL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;