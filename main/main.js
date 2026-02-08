const categoryBox = document.querySelector('.category-box'); 
const categorySelect = document.querySelector('#Category');

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
function calculateStatus(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0,0,0,0);

    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
        const currentStatus = calculateStatus(product.expiryDate); 
        const card = document.createElement('div');
        card.className = `product-card ${currentStatus}`; 

        const displayImage = product.Image ? product.Image : 'Image/default-product.png';

        let statusDot = "";
        if (currentStatus === "normal") statusDot = "<span style='color: #28a745;'>●</span>";
        else if (currentStatus === "expirysoon") statusDot = "<span style='color: #ffc107;'>●</span>";
        else if (currentStatus === "expired") statusDot = "<span style='color: #dc3545;'>●</span>";

        card.innerHTML = `
            <button class="btn-edit" onclick="editProduct(${product.id})">
                <img src="Image/edit.jpg">
            </button>
            <img src="${displayImage}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>สถานะ: ${statusDot} ${currentStatus}</p>
                <p>วันที่ผลิต: <strong>${product.mfgDate || '-'}</strong></p>
                <p>วันหมดอายุ: <strong>${product.expiryDate}</strong></p>
                <p class="countdown" id="timer-${product.id}">กำลังคำนวณ...</p> 
            </div>
        `;
        productList.appendChild(card);
    });
    updateAllCountdowns();
}
document.addEventListener('DOMContentLoaded', () => {
    fetchProductsFromDB(); 
    updateAllCountdowns()
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
        const matchCategory = (selectedCategory === "all" || String(product.category) === String(selectedCategory));
        const currentStatus = calculateStatus(product.expiryDate);
        const matchStatus = (selectedStatus === "Status" || currentStatus === selectedStatus);
        

        
        const matchSearch = product.name.toLowerCase().includes(searchQuery);

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
}
function updateAllCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    
    countdownElements.forEach(el => {
        const productId = parseInt(el.id.replace('timer-', ''));
        const product = products.find(p => p.id === productId);

        if (product) {
            const [year, month, day] = product.expiryDate.split('-').map(Number);
            const expiryTime = new Date(year, month - 1, day, 23, 59, 59).getTime();
            const now = new Date().getTime();
            const diff = expiryTime - now;

            if (isNaN(expiryTime) || diff <= 0) {
                el.innerHTML = "<span style='color:red; font-weight:bold;'>ผลิตภัณฑ์หมดอายุ!</span>";
            } else {

                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                const hours = h.toString().padStart(2, '0');
                const minutes = m.toString().padStart(2, '0');
                const seconds = s.toString().padStart(2, '0');
                
                el.innerText = `${d} วัน ${hours}:${minutes}:${seconds}`;
            }
        }
    });
}


async function saveProduct() {
    const id = parseInt(document.getElementById('edit-id').value);

    const updatedData = {
        name: document.getElementById('edit-name').value,
        mfgDate: document.getElementById('edit-mfg').value,
        expiryDate: document.getElementById('edit-expiry').value,
        category: document.getElementById('edit-Category').value,
        Image: document.getElementById('edit-preview-img').src
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