function openFile() {
    document.getElementById("photo_input").click();
}

document.getElementById("photo_input").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("previewimage");
    const text = document.getElementById("phototext");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            text.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

function openModal() {
    document.getElementById("barcodeModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("barcodeModal").style.display = "none";
}
function Back() {
    window.location.href = "../main.html"
}

async function Submit() {
    const userId = localStorage.getItem('user_id'); 
    const categoryId = document.getElementById("Category").value;
    if (!userId) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        return;
    }
    if (categoryId === "" || categoryId === "Category") {
        alert("กรุณาเลือกหมวดหมู่สินค้าก่อนบันทึก");
        return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('category_id', document.getElementById("Category").value);
    formData.append('name', document.getElementById("Name").value);
    formData.append('mfg', document.getElementById("MFG").value);
    formData.append('exp', document.getElementById("EXP").value);
    formData.append('activate', document.getElementById("Activate").value);

    const productImage = document.getElementById('photo_input').files[0];
    if (productImage) {
        formData.append('product_image', productImage); 
    }

    try {
        const response = await fetch('/api/add-product', {
            method: 'POST',
            body: formData 
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = "../main.html"; 
        } else {
            alert("เกิดข้อผิดพลาด: " + result.message);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
}

function btnback() {
    window.location.href = "../main/main.html"
}
const categoryBox = document.querySelector('.category-box');

categoryBox.addEventListener('click', function() {
    this.classList.toggle('active');
});

document.addEventListener('click', function(e) {
    if (!categoryBox.contains(e.target)) {
        categoryBox.classList.remove('active');
    }
});