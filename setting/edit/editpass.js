function maskPassword(password) {
    if (!password) return "";
    if (password.length <= 2) return password;
    
    const firstTwo = password.slice(0, 2);
    const masked = "*".repeat(password.length - 2);
    return firstTwo + masked;
}
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem("userEmail");
    const displayOldPassword = document.getElementById('current-password');

    fetch(`/api/user/${email}`)
        .then(res => res.json())
        .then(user => {
            if (displayOldPassword && user.password) {
                displayOldPassword.innerText = maskPassword(user.password);
            }
        });
});

function passUpdate() {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-new-password');

    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!newPassword || !confirmPassword) {
        alert("กรุณากรอกรหัสผ่านใหม่ให้ครบ");
        return;
    }

    if (newPassword.length < 6) {
        alert("รหัสผ่านต้องอย่างน้อย 6 ตัว");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
    }

    const email = localStorage.getItem("userEmail");

    fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("อัปเดตรหัสผ่านสำเร็จ");
            window.location.href = "../manage_user.html";
        } else {
            alert(data.message || "ไม่สำเร็จ");
        }
    })
    .catch(err => {
        console.error(err);
        alert("เกิดข้อผิดพลาด");
    });
}