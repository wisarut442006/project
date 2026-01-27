function confirm(){
    const updatedName = document.getElementById('username').value;

    alert("บันทึกข้อมูลใหม่: " + updatedName + " สำเร็จ!");
    window.location.href = "../main/main.html"
};
const UserData = {
    username: "User_ExpiryMate_01",
    password: "123456",
    email: "test_user@gmail.com"
};

function displayUserData() {
    const usernameShow = document.getElementById('username-display');
    const passwordShow = document.getElementById('password-display');
    const emailShow = document.getElementById('email-display');

    if (usernameShow) usernameShow.textContent = UserData.username;
    
    if (passwordShow) passwordShow.textContent = "********"; 
    
    if (emailShow) emailShow.textContent = UserData.email;
}
function editusername() {
    window.location.href = "edit/editusername.html"
}
function editpassword() {
    window.location.href = "edit/editpassword.html"
}
function editemail() {
    window.location.href = "edit/editemail.html"
}

function confirm() {
    window.location.href = "../main/main.html";
}

document.addEventListener('DOMContentLoaded', displayUserData);