function maskEmail(email) {
    if (!email) return "";
    if (email.length <= 4) return email;
    
    const firstTwo = email.slice(0, 4);
    const masked = "*".repeat(email.length - 4);
    return firstTwo + masked;
}
function displayUserData() {
    const usernameShow = document.getElementById('username-display');
    const passwordShow = document.getElementById('password-display');
    const emailShow = document.getElementById('email-display');

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("userEmail");

    if (usernameShow && username) usernameShow.textContent = username;
    
    if (passwordShow) passwordShow.textContent = "********"; 
    
    if (emailShow && email) emailShow.textContent = maskEmail(email);
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
function enter() {
    window.location.href = "../main/main.html"
}
function btnback() {
    window.location.href = "../main/main.html"
}
document.addEventListener('DOMContentLoaded', displayUserData);