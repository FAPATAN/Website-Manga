
// ข้อมูลสินค้า (สำหรับหน้าสินค้า)
const SAKAMOTO_ITEM_ID = 'SD001';
const SAKAMOTO_ITEM_NAME = 'Sakamoto Days เล่ม 1';
const SAKAMOTO_ITEM_PRICE = 125.00;
const SAKAMOTO_ITEM_IMAGE = 'img/sakamoto.jpg';
const CART_PAGE_URL = 'Cart.html'; 


//  ลดจำนวนสินค้า หรือลบออกทั้งหมด
const removeItemFromCart = (itemId) => {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; // อ่านตะกร้าจาก localStorage (เก็บเป็น JSON string) ถ้าไม่มีให้เป็น array ว่าง
    
    // ค้นหาสินค้าที่ต้องการลดจำนวน
    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
        // ตรวจสอบจำนวนสินค้าปัจจุบัน
        if (cart[existingItemIndex].quantity > 1) {
            // 1. ถ้าจำนวน > 1: ลดจำนวนลง 1
            cart[existingItemIndex].quantity -= 1;
            console.log(`INFO: Item ID ${itemId} quantity reduced to ${cart[existingItemIndex].quantity}.`);
        } else {
            // 2. ถ้าจำนวน = 1: ลบสินค้าตัวนี้ออกจากตะกร้า
            cart = cart.filter(item => item.id !== itemId);
            console.log(`INFO: Item ID ${itemId} removed completely.`);
            alert(`สินค้าถูกลบออกจากตะกร้าแล้ว!`); // แสดง Alert เมื่อลบหมด
        }

        // บันทึกตะกร้าใหม่กลับไป
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        
        // แสดงผลตะกร้าใหม่ทันที
        renderCart();
    }
};


// ฟังก์ชัน 2: แสดงผลตะกร้าสินค้า (สำหรับหน้าตะกร้า)
// (ไม่เปลี่ยนแปลงมากนัก แต่จะแสดงจำนวนที่ลดลง)
const renderCart = () => {
    const cartItemsContainer = document.getElementById('cart-items-container'); // พื้นที่แสดงรายการใน DOM
    const totalAmountSpan = document.getElementById('total-amount');  // element แสดงยอดรวม
    //ถ้าไม่เจอ element ที่ต้องการ ให้หยุดไม่ต้องทำอะไร (ป้องกัน error)
    if (!cartItemsContainer || !totalAmountSpan) {
        return; 
    }

    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; // โหลดตะกร้าใหม่จาก localStorage
    let grandTotal = 0; // เก็บยอดรวมทั้งหมด

    cartItemsContainer.innerHTML = ''; // เคลียร์ของเดิมก่อน render ใหม่

    if (cart.length === 0) {  // ถ้าตะกร้าว่าง แสดงข้อความว่าไม่มีสินค้า
        cartItemsContainer.innerHTML = '<p class="cart-empty-message" style="text-align: center; color: #aaa;">ไม่มีหนังสือในตะกร้า</p>';
    } else {
        cart.forEach(item => { // ถ้ามีสินค้า ให้วนสร้าง element แต่ละรายการ
            const itemTotal = item.price * item.quantity; // ยอดรวมของสินค้ารายการนี้
            grandTotal += itemTotal; // บวกเข้า grand total

            const itemElement = document.createElement('div'); // สร้าง div ใหม่สำหรับ item นี้
            itemElement.classList.add('cart-item'); // ใส่ class เพื่อจัดตำแหน่ง/รูปแบบ

            // โครงสร้าง HTML สำหรับ 1 รายการสินค้าในตะกร้า
            itemElement.innerHTML = `
                <div class="item-info">
                    <input type="checkbox" class="item-checkbox" checked>
                    <img src="${item.image}" alt="${item.name}" class="item-cover-image">
                    <div class="item-details">
                        <p class="item-name">${item.name} (x${item.quantity})</p>
                        <p class="item-price">฿ ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="item-price-and-action">
                    <span class="item-total-price">฿ ${itemTotal.toFixed(2)}</span> 
                    <button class="delete-btn" data-item-id="${item.id}">ลบ</button>
                </div>
            `; // innerHTML ข้างบนคือ HTML ของแต่ละรายการ — มีปุ่ม "ลบ" ที่มี data-item-id เพื่อระบุรายการ

            cartItemsContainer.appendChild(itemElement); // เอา element นี้ใส่ลงใน container

            // ปรับปรุงการโหลดรูป: ถ้ารูปไม่พบ ให้ลอง path สำรองหลายรูปแบบ (fallback)
            const imgEl = itemElement.querySelector('.item-cover-image');
            if (imgEl) {
                const basename = (item.image || '').split('/').pop() || '';
                const candidates = [];
                if (item.image) candidates.push(item.image);
                if (basename) {
                    candidates.push(`img/${basename}`);
                    candidates.push(`./img/${basename}`);
                    candidates.push(`/${"img"}/${basename}`);
                    candidates.push(basename);
                }
                // final fallback to a known image inside img folder if available
                candidates.push('img/gachiakuta.jpg');

                let idx = 0;
                const tryNext = () => {
                    if (idx >= candidates.length) return; // give up
                    imgEl.onerror = () => {
                        idx += 1;
                        if (idx < candidates.length) {
                            imgEl.src = candidates[idx];
                        } else {
                            imgEl.onerror = null;
                        }
                    };
                    imgEl.src = candidates[idx];
                };
                tryNext();
            }
        });
    }

    totalAmountSpan.textContent = grandTotal.toFixed(2); // อัปเดตยอดรวมที่แสดงบนหน้า
    
    // ผูก Event Listener ให้ปุ่มลบ
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemIdToDelete = e.target.getAttribute('data-item-id'); // ดึง id จาก attribute
            // ไม่ต้องใช้ confirm แล้ว เพราะเราลดจำนวนทีละ 1 แทน
            removeItemFromCart(itemIdToDelete); // เรียกฟังก์ชันลดจำนวน/ลบ
        });
    });
};



// Add to Cart (เพิ่มสินค้า)
const initProductPage = () => {
    const addToCartButton = document.getElementById('add-sakamoto-btn'); // ปุ่มในหน้ารายละเอียดสินค้า

    if (addToCartButton) {
        console.log("DEBUG: ปุ่ม Add to Cart ถูกพบแล้ว!"); // Debug log ในกรณีพบปุ่ม
        
        addToCartButton.addEventListener('click', (e) => {
            console.log("DEBUG: ปุ่มถูกคลิก!"); // Debug log เมื่อคลิกปุ่ม
            
            const item = {
                id: SAKAMOTO_ITEM_ID,
                name: SAKAMOTO_ITEM_NAME,
                price: SAKAMOTO_ITEM_PRICE,
                image: SAKAMOTO_ITEM_IMAGE,
                quantity: 1 // เริ่มต้นด้วย 1
            };

            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; // โหลดตะกร้าจาก localStorage หรือสร้าง array ใหม่ถ้ายังไม่มี
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);  // ค้นหาว่าสินค้านี้มีในตะกร้าอยู่แล้วหรือไม่

            if (existingItemIndex > -1) {
                // ถ้ามีอยู่แล้ว: เพิ่มจำนวน (quantity)
                cart[existingItemIndex].quantity += 1;
            } else {
                // ถ้ายังไม่มี: เพิ่มสินค้าใหม่เข้าไป
                cart.push(item);
            }
            // บันทึกตะกร้าอัปเดตลง localStorage (แปลงเป็น JSON string)
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            // เปลี่ยนหน้าไปยังหน้าตะกร้า
            window.location.href = CART_PAGE_URL; 
        });
    } else {
         console.log("INFO: ไม่พบปุ่ม Add to Cart (OK ถ้าอยู่หน้าตะกร้า)");
    }
};


// ฟังก์ชันเริ่มต้นการทำงานเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    initProductPage(); // เริ่มผูกปุ่ม Add to Cart (ถ้ามี)
    renderCart(); // แสดงตะกร้าปัจจุบันบนหน้า (ถ้ามี element สำหรับแสดง)
});