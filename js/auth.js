// ในไฟล์ frontend/js/auth.js ส่วนของ Login Form Event Listener
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // >>> วางโค้ดไว้ตรงนี้ครับ <<<
            localStorage.setItem('token', result.token);
            localStorage.setItem('userEmail', email); // สำคัญมาก: เก็บ email เพื่อใช้แยกตะกร้าสินค้า
            
            // ถ้า Backend ส่งข้อมูลตะกร้าที่เคยเก็บไว้กลับมาด้วย ให้ดึงมาใช้เลย
            if (result.cart) {
                localStorage.setItem('cart', JSON.stringify(result.cart));
            }

            alert('เข้าสู่ระบบสำเร็จ');
            location.reload(); // หรือ window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const messageDiv = document.getElementById('regMessage');

    // [Security Check] ตรวจสอบเงื่อนไขรหัสผ่านบน Frontend
    const specialChars = /[!@#$%^&*]/;
    const upperCase = /[A-Z]/;

    if (password.length < 8 || !specialChars.test(password) || !upperCase.test(password)) {
        messageDiv.innerHTML = `<div class="alert alert-warning">รหัสผ่านไม่ตรงตามเงื่อนไขความปลอดภัย</div>`;
        return;
    }

    try {
        // [Request] ส่งข้อมูลไป Register
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.innerHTML = `<div class="alert alert-success">ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ</div>`;
            setTimeout(() => { $('#registerModal').modal('hide'); }, 2000);
        } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="alert alert-danger">ติดต่อ Server ไม่ได้</div>`;
    }
});

    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        const authNavItem = document.getElementById('auth-nav-item');
        const regNavItem = document.getElementById('reg-nav-item'); // เพิ่ม ID สำหรับปุ่ม Register

        if (token) {
            // [Action] ถ้า Login แล้ว: ซ่อนปุ่ม Register และเปลี่ยนปุ่ม Login เป็น Logout
            if (regNavItem) regNavItem.style.display = 'none'; 
            if (authNavItem) {
                authNavItem.innerHTML = `
                    <a href="#" class="nav-link" onclick="handleLogout()">
                        <span class="ion-ios-log-out"></span> Logout
                    </a>
                `;
            }
        } else {
            // [Action] ถ้ายังไม่ Login: แสดงทั้งสองปุ่มตามปกติ
            if (regNavItem) regNavItem.style.display = 'block';
            if (authNavItem) {
                authNavItem.innerHTML = `
                    <a href="#" class="nav-link" data-toggle="modal" data-target="#loginModal">
                        <span class="ion-ios-person"></span> Login
                    </a>
                `;
            }
        }
    }
    document.addEventListener('DOMContentLoaded', checkLoginStatus);

    // frontend/js/auth.js

// ฟังก์ชันสำหรับส่งข้อมูลตะกร้าไปบันทึกที่ Backend
async function syncCartToBackend() {
    const email = localStorage.getItem('userEmail'); // คุณต้องเก็บ email ไว้ตอน login ด้วย
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!email) return;

    try {
        await fetch('http://localhost:3000/api/update-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, cart })
        });
    } catch (error) {
        console.error('Failed to sync cart:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// ฟังก์ชัน Handle Logout (เพิ่มให้ครบ)
function handleLogout() {
    // ลบ Token ออกเพื่อยกเลิกสถานะการเข้าสู่ระบบ
    localStorage.removeItem('token');
    
    // ลบ Email ออก
    localStorage.removeItem('userEmail');
    
    // *** เพิ่มบรรทัดนี้: ลบรายการสินค้าในตะกร้าออก ***
    localStorage.removeItem('shopping_cart'); 
    
    // โหลดหน้าเว็บใหม่เพื่อให้ Navbar และปุ่มต่างๆ กลับเป็นสถานะเริ่มต้น
    window.location.reload(); 
}