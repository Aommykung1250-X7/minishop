const express = require('express');
const cors = require('cors'); // 1. นำเข้า cors
const app = express();
const productRoutes = require('./routes/productRoutes');
const port = 3000;

app.use(cors()); // 2. สั่งให้ Express ใช้งาน cors (วางไว้ก่อน Route นะ)
app.use(express.json());
app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Architecture Server running at http://localhost:${port}`);
});