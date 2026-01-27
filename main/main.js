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

const products = [
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
        expiryDate: "30/01/2026",
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
function filterProducts() {
    const selectedCategory = document.getElementById('Category').value;
    const selectedStatus = document.getElementById('Status').value;

    const filtered = products.filter(product => {
        const matchCategory = (selectedCategory === "Category" || product.category === selectedCategory);
        
        const matchStatus = (selectedStatus === "Status" || product.status === selectedStatus);

        return matchCategory && matchStatus;
    });
    renderProducts(filtered);
}

document.getElementById('Category').addEventListener('change', filterProducts);
document.getElementById('Status').addEventListener('change', filterProducts);

function renderProducts(items) {
    const productList = document.getElementById('product-list')
    productList.innerHTML = '';

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = `product-card ${product.status}`;
        let statusDot = "";
        if (product.status === "normal") statusDot = "<span style='color: #28a745;'>●</span>";
        else if (product.status === "expirysoon") statusDot = "<span style='color: #ffc107;'>●</span>";
        else if (product.status === "expired") statusDot = "<span style='color: #dc3545;'>●</span>";
        

        card.innerHTML = `
        <button class="btn-edit" onclick="editProduct(${product.id})">
            <img src="Image/edit.jpg">
        </button>
            <img src="${product.Image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>สถานะ: ${statusDot} ${product.status}</p>
                <p>วันหมดอายุ: <strong>${product.expiryDate}</strong></p>
                <p>00:00:00</p>
            </div>
        `;
        productList.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('edit-id').value = product.id;
        document.getElementById('edit-name').value = product.name;
        document.getElementById('edit-expiry').value = product.expiryDate;

        const categorySelect = document.querySelector('#editModal select');
        if(categorySelect) categorySelect.value = product.category;

        document.getElementById('edit-preview-img').src = product.Image;
        document.getElementById('editModal').style.display = "block";
    }
}
function handleFileSelect(event) {
    const file = event.target.files[0]; 
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            document.getElementById('edit-preview-img').src = e.target.result;
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

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const id = parseInt(document.getElementById('edit-id').value);
    const updatedName = document.getElementById('edit-name').value;
    const updatedExpiry = document.getElementById('edit-expiry').value;
    const updatedImage = document.getElementById('edit-preview-img').src;

    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index].name = updatedName;
        products[index].expiryDate = updatedExpiry;
        products[index].Image = updatedImage;
        
        const categorySelect = document.querySelector('#editModal select');
        if(categorySelect) products[index].category = categorySelect.value;

        renderProducts(products);
        closeModal();
        alert("อัปเดตข้อมูลสำเร็จ!");
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}
function opensetting() {
    document.getElementById("setting-dropdown").classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.closest('.btn-setting')) {
        var dropdowns = document.getElementsByClassName("setting-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}
function btnback() {
    window.location.href = "../home/home.html"
}