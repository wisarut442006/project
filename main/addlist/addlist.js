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
function Submit() {
    window.location.href = "../main.html"
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