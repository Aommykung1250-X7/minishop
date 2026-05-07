// 1. ควบคุมการแสดงผลช่องกรอกบัตรเครดิต (Payment Method Selection)
document.addEventListener('change', function(e) {
    if (e.target && e.target.name === 'payment_method') {
        const cardSection = document.getElementById('card-input-section');
        const cardInput = document.getElementById('cardnumber');
        
        if (e.target.value === 'credit_card') {
            cardSection.style.display = 'block';
            cardInput.setAttribute('required', 'true');
        } else {
            cardSection.style.display = 'none';
            cardInput.removeAttribute('required');
        }
    }
});

// 2. ฟังก์ชันหลักสำหรับส่งข้อมูลสั่งซื้อไปที่ Backend
async function processCheckout(event) {
    event.preventDefault();

    // 1. ดึงค่าช่องทางการชำระเงินที่เลือก
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value;
    const cardNumber = document.getElementById('cardnumber').value;
    const savedCart = JSON.parse(localStorage.getItem('shopping_cart')) || [];

    // 2. Validation เบื้องต้น
    if (savedCart.length === 0) {
        alert("กรุณาเลือกสินค้าก่อนสั่งซื้อ");
        return;
    }

    // เช็กบัตรเครดิตเฉพาะกรณีที่เลือกจ่ายผ่านบัตร
    if (paymentMethod === 'credit_card') {
        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            alert("กรุณากรอกเลขบัตรเครดิตให้ถูกต้อง (ตัวเลข 16 หลัก)");
            return;
        }
    }

    // 3. เตรียมโครงสร้างข้อมูลที่สมบูรณ์
    const orderData = {
        user_id: 1, // สามารถเปลี่ยนเป็นตัวแปรจากการ Login ได้[cite: 2]
        email: document.getElementById('emailaddress').value,
        payment_method: paymentMethod,
        cardNumber: paymentMethod === 'credit_card' ? cardNumber : "N/A",
        shippingAddress: {
            fullName: `${document.getElementById('firstname').value} ${document.getElementById('lastname').value}`,
            address: document.getElementById('streetaddress').value,
            city: document.getElementById('towncity').value,
            zipCode: document.getElementById('postcodezip').value
        },
        // ปรับแต่ง Cart ให้ Backend นำไปบันทึกลง SQL ได้ง่าย
        cart: savedCart.map(item => {
            // ลบเครื่องหมาย $ ออกจากราคาถ้ามี เพื่อให้เป็นตัวเลข (Float)
            const cleanPrice = typeof item.price === 'string' 
                ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
                : item.price;
            
            return {
                product_id: item.id, // ให้ตรงกับชื่อฟิลด์ใน store.db
                product_name: item.name,
                quantity: parseInt(item.quantity),
                price: cleanPrice,
                total_price: cleanPrice * parseInt(item.quantity)
            };
        })
    };

    // 4. ส่งข้อมูลไปที่ Backend
    try {
        const response = await fetch('http://localhost:3000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            localStorage.removeItem('shopping_cart'); // ล้างตะกร้าเมื่อสำเร็จ
            window.location.href = 'index.html'; 
        } else {
            alert("การสั่งซื้อล้มเหลว: " + result.message);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่ารัน backend/app.js อยู่");
    }
}

// 3. เริ่มทำงานเมื่อโหลดหน้าเว็บสำเร็จ
document.addEventListener('DOMContentLoaded', () => {
    // เรียกใช้ฟังก์ชันคำนวณราคาจากไฟล์อื่น (ถ้ามี)
    if (typeof calculateCartTotals === 'function') {
        calculateCartTotals();
    }
    
    // ผูกเหตุการณ์การส่งฟอร์มเข้ากับฟังก์ชัน processCheckout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', processCheckout);
    }
});