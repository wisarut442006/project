const currentUser = {
    username: "User_ExpiryMate_01",
    password: "123456",
    email: "test_user@gmail.com"
};
document.addEventListener('DOMContentLoaded', () => {
    const displayOldName = document.getElementById('current-username');
    if (displayOldName) {
        displayOldName.innerText = currentUser.username; 
    }
    
});
document.addEventListener('DOMContentLoaded', () => {
    const displayOldPassword = document.getElementById('current-password');
    if (displayOldPassword) {
        displayOldPassword.innerText = currentUser.password; 
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const displayOldEmail = document.getElementById('current-email');
    if (displayOldEmail) {
        displayOldEmail.innerText = currentUser.email;
    }
});
function userUpdate() {
    const newNameInput = document.getElementById('new-username');
    const displayOldName = document.getElementById('current-username');
    const newUsername = newNameInput.value.trim();
    if (!newUsername) {
        alert("กรุณากรอกชื่อผู้ใช้ใหม่");
        return;
    }
    if (newUsername === currentUser.username) {
        alert("ชื่อใหม่ต้องไม่ซ้ำกับชื่อเดิม");
        return;
    }
    currentUser.username = newUsername; 
    displayOldName.innerText = currentUser.username;
    alert("อัปเดตชื่อผู้ใช้สำเร็จ!");
    newNameInput.value = ""; 

    window.location.href = "../manage_user.html";
}
function passUpdate() {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-new-password');
    
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();


    if (!newPassword || !confirmPassword) {
        alert("กรุณากรอกรหัสผ่านใหม่ให้ครบทั้ง 2 ช่อง");
        return;
    }

    if (newPassword.length < 6) {
        alert("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
        return;
    }

    if (newPassword === currentUser.password) {
        alert("รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
        confirmPasswordInput.value = ""; 
        confirmPasswordInput.focus();
        return;
    }

    currentUser.password = newPassword;
    
    alert("อัปเดตรหัสผ่านใหม่สำเร็จ!");

    newPasswordInput.value = "";
    confirmPasswordInput.value = "";

    window.location.href = "../manage_user.html";
}
function otp_email() {
    const newEmailInput = document.getElementById('new-email');
    const newEmail = newEmailInput.value.trim();
    
    if (!newEmail) {
        alert("กรุณากรอก Email ใหม่ที่ต้องการ");
        return;
    }
    
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailPattern.test(newEmail)) {
        alert("กรุณากรอกรูปแบบ Email ให้ถูกต้อง");
        return;
    }
    
    if (newEmail === currentUser.email) {
        alert("Email ใหม่ต้องไม่ซ้ำกับ Email เดิม");
        return;
    }
    document.getElementById('otp-modal').style.display = 'flex';
}
function closeOtpModal() {
    document.getElementById('otp-modal').style.display = 'none';
}
function verifyOtp() {
    const otpValue = document.getElementById('otp-input').value;
    const newEmail = document.getElementById('new-email').value;

    if (otpValue === "123456") { 
        currentUser.email = newEmail;
        alert("ยืนยัน OTP สำเร็จ และอัปเดต Email แล้ว!");
        window.location.href = "../manage_user.html";
    } else {
        alert("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่ (รหัสทดสอบคือ 123456)");
    }
}