// 1. สร้าง Object สำหรับเก็บข้อมูลในตะกร้าสินค้า
     let cart = [];

/**
 * ฟังก์ชันจัดการเมื่อมีการคลิกที่ตะกร้าสินค้า (Handler)
 * @param {string} productId - ID ของสินค้า
 * @param {string} price - ราคาสินค้าที่ขายจริง
 */
function handleAddToCart(productId, price) {
    // เช็กว่ามีสินค้านี้ในตะกร้าหรือยัง ถ้ามีแล้วให้เพิ่มจำนวน ถ้าไม่มีให้เริ่มที่ 1
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = {
            price: price,
            quantity: 1
        };
    }
    
    console.log(`เพิ่มสินค้า ID: ${productId} เข้าตะกร้าแล้ว!`, cart);
    alert(`เพิ่มสินค้าลงตะกร้าเรียบร้อย! ราคา ${price}`);
}

// 2. ตั้งค่า Event Listener ที่ตัวแม่ (#product-list-container)
const productList = document.getElementById('product-list-container');

if (productList) {
    productList.addEventListener('click', function(event) {
        event.preventDefault();
        const btn = event.target.closest('.add-to-cart');

        if (btn) {
            const id = btn.getAttribute('data-id');
            const price = btn.getAttribute('data-price');

            // แก้ตรงนี้ครับ! เปลี่ยนจาก handleAddToCart เป็น addToCart
            // เพื่อให้มันวิ่งไปทำฟังก์ชันที่มี saveToLocalStorage และ updateCartUI
            addToCart(id, price); 
        }
    });
}

/**
 * ฟังก์ชันเพิ่มสินค้าลงตะกร้า (Update existing array)
 * @param {number|string} productid - ID ของสินค้าจาก data-id
 * @param {string} productprice - ราคาสินค้าจาก data-price
 */
function addToCart(productid, productprice) {
    // 1. ใช้ .find() เพื่อเช็กว่าสินค้าตัวนี้ "มีอยู่ในตะกร้าแล้วหรือยัง"
    const existingProduct = cart.find(item => item.id == productid);

    if (existingProduct) {
        // 2. ถ้ามีอยู่แล้ว: เพิ่มจำนวนขึ้น 1 (Increment quantity)
        existingProduct.quantity += 1;
        console.log(`เพิ่มจำนวนสินค้า ID: ${productid} (Total: ${existingProduct.quantity})`);
    } else {
        // 3. ถ้ายังไม่มี: ใช้ .find() หาข้อมูลสินค้าตัวเต็มจาก Array allProducts
        // โดยใช้ ID ที่ส่งเข้ามาเปรียบเทียบ
        const productFromData = allProducts.find(p => p.id == productid);

        if (productFromData) {
            // สร้าง Object ใหม่พร้อมคุณสมบัติที่ต้องการ แล้ว Push เข้า Array cart
            const newCartItem = {
                id: productFromData.id,
                product_name: productFromData.product_name,
                price: productprice, // ใช้ราคาที่ส่งมาจากปุ่ม (Sale price)
                image_url: productFromData.image_url,
                quantity: 1
            };
            
            cart.push(newCartItem);
            console.log(`เพิ่มสินค้าใหม่ ID: ${productid} เข้าตะกร้า`);
        }
    }

    // 4. เรียกใช้ฟังก์ชันบันทึกข้อมูลและอัปเดตหน้าเว็บตามโจทย์
    saveToLocalStorage();
    updateCartUI();
}

// ฟังก์ชันบันทึกข้อมูลลง Browser Storage
function saveToLocalStorage() {
    alert('บันทึกข้อมูลลง Local Storage เรียบร้อย!');
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
}

/**
 * ฟังก์ชันอัปเดตตัวเลขจำนวนสินค้าบน Navbar
 */
function updateCartUI() {
    // alert('อัปเดตตะกร้าเรียบร้อย!');
    // 1. คำนวณจำนวนชิ้นสินค้าทั้งหมดในตะกร้า (sum of all quantities)
    // ถ้า cart ว่าง จะได้ค่าเริ่มต้นเป็น 0
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // 2. เข้าถึง Element ที่แสดงตัวเลข
    const cartBadge = document.getElementById('cart-count');

    if (cartBadge) {
        // 3. อัปเดตข้อความ โดยใส่เครื่องหมาย [ ] ล้อมรอบตามรูปแบบเดิมของคุณ
        cartBadge.innerText = `[${totalItems}]`;
        
        // (Optional) เพิ่มลูกเล่น: ถ้ามีของในตะกร้า ให้เปลี่ยนสีหรือขยายขนาดชั่วคราว
        if (totalItems > 0) {
            cartBadge.style.color = "#ff0000"; // เปลี่ยนเป็นสีส้มเมื่อมีของ
        }
    }
    
    console.log(`UI Updated: มีสินค้าในตะกร้าทั้งหมด ${totalItems} ชิ้น`);
}

/**
 * ฟังก์ชันโหลดข้อมูลตะกร้าสินค้าจาก Local Storage เมื่อเปิดหน้าเว็บ
 */
function loadLocalStorage() {
    // alert('กำลังโหลดข้อมูลจาก Local Storage...');
    // 1. ดึงข้อมูลจาก Local Storage โดยใช้ Key เดียวกับตอนบันทึก
    const savedCart = localStorage.getItem('shopping_cart');

    // 2. ตรวจสอบว่ามีข้อมูลอยู่จริงหรือไม่
    if (savedCart) {
        try {
            // 3. แปลงข้อมูลจาก String กลับมาเป็น Array (หรือ Object ตามที่คุณใช้)
            // และเก็บค่าลงในตัวแปร cart ที่เราประกาศไว้ด้านบนสุด
            cart = JSON.parse(savedCart);
            
            console.log("โหลดข้อมูลจาก Local Storage สำเร็จ:", cart);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการแปลงข้อมูลตะกร้า:", error);
            // หากข้อมูลเพี้ยน ให้รีเซ็ตเป็น Array ว่าง
            cart = []; 
        }
    }

    // 4. หลังจากโหลดข้อมูลเสร็จ ให้เรียกอัปเดตตัวเลขบน Navbar ทันที
    updateCartUI();
}


// คำนวณราคาสินค้า
/**
 * ฟังก์ชันคำนวณราคาสรุปในหน้าตะกร้าสินค้า
 */
function calculateCartTotals() {
    // 1. ดึงข้อมูลจาก Local Storage (ใช้ชื่อ Key เดิมของคุณ)
    const savedCart = localStorage.getItem('shopping_cart');
    let subtotal = 0;

    if (savedCart) {
        const cartData = JSON.parse(savedCart);
        
        // 2. คำนวณราคารวมสินค้าทั้งหมด
        subtotal = cartData.reduce((total, item) => {
            // ลบเครื่องหมาย $ ออกก่อนแปลงเป็นตัวเลข (รองรับรูปแบบราคาของคุณ)
            const price = typeof item.price === 'string' 
                ? parseFloat(item.price.replace('$', '')) 
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    }

    // 3. ตั้งค่าคงที่สำหรับหน้า Checkout
    const delivery = 0.00; 
    const discount = 0.00; 
    const finalTotal = subtotal + delivery - discount;

    // 4. อัปเดตตัวเลขลงใน HTML ตาม ID ที่เราตั้งไว้[cite: 1]
    const subtotalEl = document.getElementById('cart-subtotal');
    const deliveryEl = document.getElementById('cart-delivery');
    const discountEl = document.getElementById('cart-discount');
    const totalFinalEl = document.getElementById('cart-total-final');

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (deliveryEl) deliveryEl.innerText = `$${delivery.toFixed(2)}`;
    if (discountEl) discountEl.innerText = `$${discount.toFixed(2)}`;
    if (totalFinalEl) totalFinalEl.innerText = `$${finalTotal.toFixed(2)}`;
    
    console.log("Checkout Totals Updated:", { subtotal, finalTotal });
}

// เรียกใช้ฟังก์ชันทันทีเมื่อโหลดหน้า Checkout[cite: 1]
document.addEventListener('DOMContentLoaded', calculateCartTotals);
