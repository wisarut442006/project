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

let products = [
    {
        id: 1,
        name: "นมจืด",
        category: "freshfood",
        expiryDate: "12/02/2026",
        status: "normal",
        Image: "Image/milk.png"
    },
    {
        id: 2,
        name: "ยาพาราเซตามอล",
        category: "medicine",
        expiryDate: "28/02/2026",
        status: "expirysoon",
        Image: "Image/medicine.jpg"
    },
    {
        id:3,
        name: "บะหมี่กึ่งสำเร็จรูป",
        category: "driedfood",
        expiryDate: "24/02/2026",
        status: "expired",
        Image: "Image/noodle.jpg"
    }
];
function calculateStatus(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
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
    const [day, month, year] = dateStr.split('/').map(Number);
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

        let statusDot = "";
        if (currentStatus === "normal") statusDot = "<span style='color: #28a745;'>●</span>";
        else if (currentStatus === "expirysoon") statusDot = "<span style='color: #ffc107;'>●</span>";
        else if (currentStatus === "expired") statusDot = "<span style='color: #dc3545;'>●</span>";

        card.innerHTML = `
        <button class="btn-edit" onclick="editProduct(${product.id})">
            <img src="Image/edit.jpg">
        </button>
            <img src="${product.Image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>สถานะ: ${statusDot} ${currentStatus}</p>
                <p>วันหมดอายุ: <strong>${product.expiryDate}</strong></p>
                <p class="countdown" id="timer-${product.id}">กำลังคำนวณ...</p> 
            </div>
        `;
        productList.appendChild(card);
    });
    updateAllCountdowns();
}
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);

    document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const id = parseInt(document.getElementById('edit-id').value);
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        products[index].name = document.getElementById('edit-name').value;
        products[index].expiryDate = document.getElementById('edit-expiry').value;
        products[index].Image = document.getElementById('edit-preview-img').getAttribute('src');
        
        products[index].status = calculateStatus(products[index].expiryDate);

        const categorySelectEdit = document.getElementById('edit-Category');
        if(categorySelectEdit) products[index].category = categorySelectEdit.value;

        closeModal();
        filterProducts(); 
        alert("อัปเดตข้อมูลสำเร็จ!"); 
    }
    
    

   
});
});
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('edit-id').value = product.id;
        document.getElementById('edit-name').value = product.name;
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
        const matchCategory = (selectedCategory === "Category" || product.category === selectedCategory);
        const matchStatus = (selectedStatus === "Status" || product.status === selectedStatus);
        
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
            const [day, month, year] = product.expiryDate.split('/').map(Number);
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
