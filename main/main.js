const categoryBox = document.querySelector('.category-box'); 
const categorySelect = document.querySelector('#Category');

let settingValue = 7;
const userId = Number(localStorage.getItem("user_id"));


categorySelect.addEventListener('click', () => {
    categoryBox.classList.toggle('active');
});

categorySelect.addEventListener('blur', () => {
    categoryBox.classList.remove('active');
});

const statusBox = document.querySelector('.status-box'); 
const statusSelect = document.querySelector('#Status');

statusSelect.addEventListener('click', () => {
    statusBox.classList.toggle('active');
});

statusSelect.addEventListener('blur', () => {
    statusBox.classList.remove('active');
});
function addlist(){
    window.location.href = "/main/addlist/addlist.html"
}
function history(){
    window.location.href = "/main/history/history.html"
}
let products = [];
async function fetchProductsFromDB() {
    try {
        const response = await fetch('/api/get-products');
        const data = await response.json();
        
        products = [...data];   
        filterProducts(); 
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}
function calculateStatus(product) {
    let hasExpDate = product.expiryDate && product.expiryDate !== "0000-00-00";
    let finalExpiryDate = hasExpDate ? new Date(product.expiryDate) : new Date("9999-12-31");

    const isActive = Number(product.isActivated) === 1;
    // ถ้ามีการเปิดใช้ ให้คิดจากวันเปิดด้วย
    if ((isActive || !hasExpDate) && product.activateDate && product.expAfterActivate > 0) {
        let openExpiry = new Date(product.activateDate);
        openExpiry.setDate(openExpiry.getDate() + parseInt(product.expAfterActivate));

        // เอาวันที่หมดก่อน
        if (!hasExpDate || openExpiry < finalExpiryDate) {
            finalExpiryDate = openExpiry;
        }
    }

    if (!hasExpDate && (!product.activateDate || !product.expAfterActivate)) {
        return "normal";
    }

    const expiryTime = finalExpiryDate.setHours(23, 59, 59, 999);
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= 7) return "expirysoon";
    return "normal";
}

function calculateTimeLeft(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const expiry = new Date(year, month - 1, day).getTime();
    const now = new Date().getTime();
    const diff = expiry - now;

    if (diff < 0) return "หมดอายุแล้ว";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `เหลือเวลาอีก ${days} วัน`;
}


document.getElementById('Category').addEventListener('change', filterProducts);
document.getElementById('Status').addEventListener('change', filterProducts);

function renderProducts(items) {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    productList.innerHTML = '';



    items.forEach(product => {
        const currentStatus = calculateStatus(product);

        const card = document.createElement('div');
        card.className = `product-card ${currentStatus}`; 

        const displayImage = product.Image ? product.Image : 'Image/default-product.png';

        let statusDot = "";
        let statusText = "";
        if (currentStatus === "normal") { statusText = "ปกติ"; statusDot = "<span style='color: #28a745;'>●</span>"; }
        else if (currentStatus === "expirysoon") { statusText = "ใกล้หมดอายุ"; statusDot = "<span style='color: #ffc107;'>●</span>"; }
        else { statusText = "หมดอายุแล้ว"; statusDot = "<span style='color: #dc3545;'>●</span>"; }

        let hasExpDate = product.expiryDate && product.expiryDate !== "0000-00-00";
        let finalExpiryDate = hasExpDate ? new Date(product.expiryDate) : null;

        const isActive = Number(product.isActivated) === 1;
        if ((isActive || !hasExpDate) && product.activateDate && product.expAfterActivate > 0) {
            let openExpiry = new Date(product.activateDate);
             openExpiry.setDate(openExpiry.getDate() + parseInt(product.expAfterActivate));

        if (!hasExpDate || openExpiry < finalExpiryDate) {
         finalExpiryDate = openExpiry;
        }
        }       

        let showExp = finalExpiryDate 
        ? finalExpiryDate.toISOString().split('T')[0] 
        : "ไม่ได้ระบุ";


        card.innerHTML = `
            <button class="btn-edit" onclick="editProduct(${product.id})">
                <img src="Image/edit.jpg">
            </button>
            <img src="${displayImage}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p id="status-${product.id}">สถานะ: ${statusDot} ${statusText}</p>
                <p>วันที่ผลิต: <strong>${product.mfgDate || '-'}</strong></p>
                <p>วันหมดอายุ: <strong>${showExp}</strong></p>
                <p class="countdown" id="timer-${product.id}">กำลังคำนวณ...</p> 
            </div>
        `;
        productList.appendChild(card);
    });
    updateAllCountdowns();
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadNotificationSetting();
    await fetchProductsFromDB();
    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);
});
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('edit-id').value = product.id;
        document.getElementById('edit-name').value = product.name;
        document.getElementById('edit-mfg').value = product.mfgDate || "";
        document.getElementById('edit-expiry').value = product.expiryDate;

        const categorySelectEdit = document.getElementById('edit-Category');
        if(categorySelectEdit) categorySelectEdit.value = product.category;

        document.getElementById('edit-preview-img').src = product.Image;
        document.getElementById('editModal').style.display = "block";
    }
    const hasActivate = product.activateDate && product.expAfterActivate > 0;

    document.getElementById("edit-hasActivate").checked = hasActivate;
    document.getElementById("edit-activateDate").value = product.activateDate || "";
    document.getElementById("edit-expAfterActivate").value = product.expAfterActivate || "";

    toggleEditActivate();
}
function handleFileSelect(event) {
    const file = event.target.files[0]; 
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById('edit-preview-img');
            previewImg.src = e.target.result; 
        };
        reader.readAsDataURL(file); 
    }
}
function changepicture() {
    document.getElementById('file-input').click();
}


function closeModal() {
    document.getElementById('editModal').style.display = "none";
}



function opensetting() {
    document.getElementById("setting-dropdown").classList.toggle("show");
}
function btnback() {
    window.location.href = "../home_contact/home.html"
}
function filterProducts() {
    const selectedCategory = document.getElementById('Category').value;
    const selectedStatus = document.getElementById('Status').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    const filtered = products.filter(product => {
        const matchCategory =
            (selectedCategory === "all" || String(product.category) === String(selectedCategory));

        const matchStatus =
            (selectedStatus === "สถานะ" || calculateStatus(product) === selectedStatus);

        const matchSearch =
            product.name.toLowerCase().includes(searchQuery);

        return matchCategory && matchStatus && matchSearch;
    });

    renderProducts(filtered);
}

window.onclick = function(event) {
    if (!event.target.closest('.btn-setting')) {
        const dropdowns = document.getElementsByClassName("setting-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}

function deleteProduct() {
    const id = parseInt(document.getElementById('edit-id').value);
    const productName = document.getElementById('edit-name').value;

    if (confirm(`คุณต้องการลบรายการ "${productName}" ใช่หรือไม่?`)) {
        products = products.filter(p => p.id !== id);
        
        filterProducts();
        closeModal();
    }
}const notifiedKey = "notified_product_levels";
let notifiedLevels = new Set(
  JSON.parse(localStorage.getItem(notifiedKey) || "[]")
);

function getNotifyLevels(settingValue) {
  if (settingValue >= 5) return [settingValue, 3, 1];
  if (settingValue >= 3) return [settingValue, 1];
  return [settingValue];
}
function updateAllCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');

    countdownElements.forEach(el => {
        const productId = parseInt(el.id.replace('timer-', ''));
        const product = products.find(p => p.id === productId);

        if (!product) return;

        const statusEl = document.getElementById(`status-${product.id}`);

        let hasExpDate = product.expiryDate && product.expiryDate !== "0000-00-00";
        let finalExpiryDate = hasExpDate ? new Date(product.expiryDate) : new Date("9999-12-31");

        const isActive = Number(product.isActivated) === 1;

        if ((isActive || !hasExpDate) && product.activateDate && product.expAfterActivate > 0) {
            let openExpiry = new Date(product.activateDate);
            openExpiry.setDate(openExpiry.getDate() + parseInt(product.expAfterActivate));

            if (!hasExpDate || openExpiry < finalExpiryDate) {
                finalExpiryDate = openExpiry;
            }
        }

        if (!hasExpDate && (!product.activateDate || !product.expAfterActivate)) {
            el.innerText = "ไม่ได้ระบุวันหมดอายุ";
            return;
        }

        const expiryTime = finalExpiryDate.setHours(23, 59, 59, 999);
        const now = new Date().getTime();
        const diff = expiryTime - now;
        const card = el.closest('.product-card');

        const d = Math.ceil(diff / (1000 * 60 * 60 * 24));

        // ===== หมดอายุแล้ว =====
        if (diff <= 0) {
            el.innerHTML = "<span style='color:red; font-weight:bold;'>ผลิตภัณฑ์หมดอายุ!</span>";

            if (card) card.className = 'product-card expired';
            if (statusEl) {
                statusEl.innerHTML =
                    "สถานะ: <span style='color:#dc3545;'>●</span> หมดอายุแล้ว";
            }

            const expiredKey = `${product.id}_expired`;

            if (!notifiedLevels.has(expiredKey)) {
                notifiedLevels.add(expiredKey);
                localStorage.setItem(notifiedKey, JSON.stringify([...notifiedLevels]));

                showToast(`สินค้า ${product.name} หมดอายุแล้ว`);

                fetch("http://localhost:3000/add-notification-log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        product_id: product.id,
                        message: `สินค้า ${product.name} หมดอายุแล้ว`,
                        type: "0"
                    })
                });
            }
            return;
        }

        // ===== ยังไม่หมดอายุ =====
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            .toString().padStart(2, '0');
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            .toString().padStart(2, '0');
        const s = Math.floor((diff % (1000 * 60)) / 1000)
            .toString().padStart(2, '0');

        const levels = getNotifyLevels(settingValue);

        levels.forEach(level => {
            const key = `${product.id}_${level}`;

            if (d <= level && d > 0 && !notifiedLevels.has(key)) {
                notifiedLevels.add(key);
                localStorage.setItem(notifiedKey, JSON.stringify([...notifiedLevels]));

                showToast(`สินค้า ${product.name} เหลือ ${level} วัน`);

                fetch("http://localhost:3000/add-notification-log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        product_id: product.id,
                        message: `สินค้า ${product.name} เหลือ ${level} วัน`,
                        type: level
                    })
                });
            }
        });

        el.innerText = `${d} วัน ${h}:${m}:${s}`;

        if (d <= 7) {
            if (card) card.className = 'product-card expirysoon';
            if (statusEl) {
                statusEl.innerHTML =
                    "สถานะ: <span style='color:#ffc107;'>●</span> ใกล้หมดอายุ";
            }
        } else {
            if (card) card.className = 'product-card normal';
            if (statusEl) {
                statusEl.innerHTML =
                    "สถานะ: <span style='color:#28a745;'>●</span> ปกติ";
            }
        }
    });
}




async function saveProduct() {
    const id = parseInt(document.getElementById('edit-id').value);
    const hasActivate = document.getElementById("edit-hasActivate").checked;

    let activateDate = document.getElementById("edit-activateDate").value;

    if (hasActivate && !activateDate) {
        activateDate = new Date().toISOString().split("T")[0];
    }

    const updatedData = {
        name: document.getElementById('edit-name').value,
        mfgDate: document.getElementById('edit-mfg').value,
        expiryDate: document.getElementById('edit-expiry').value,
        category: document.getElementById('edit-Category').value,
        Image: document.getElementById('edit-preview-img').src,

        activateDate: activateDate,
        expAfterActivate: document.getElementById("edit-expAfterActivate").value,
        isActivated: hasActivate
    };

    try {
        const response = await fetch(`/api/update-product/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (result.success) {
            await fetchProductsFromDB();
            closeModal();
        } else {
            alert("แก้ไขไม่สำเร็จ");
        }

    } catch (error) {
        console.error("Update error:", error);
    }
}


async function deleteProduct() {
    const id = parseInt(document.getElementById('edit-id').value);
    const productName = document.getElementById('edit-name').value;

    if (confirm(`คุณต้องการลบรายการ "${productName}" ใช่หรือไม่?`)) {
        try {
            const response = await fetch(`/api/delete-product/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                alert("ลบรายการสำเร็จแล้ว");
                await fetchProductsFromDB();
                closeModal();
            } else {
                alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
        }
    }
}
function toggleEditActivate() {
    const checked = document.getElementById("edit-hasActivate").checked;
    document.getElementById("edit-activate-box").style.display = checked ? "block" : "none";
}
function showToast(message){
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 8000);
}
async function loadNotificationSetting() {
  const userId = localStorage.getItem("user_id");
  const res = await fetch(`/api/notification-setting/${userId}`);
  const data = await res.json();
  settingValue = data.days;
}