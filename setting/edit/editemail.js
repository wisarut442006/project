function maskEmail(email) {
    if (!email) return "";
    if (email.length <= 4) return email;
    
    const firstTwo = email.slice(0, 4);
    const masked = "*".repeat(email.length - 4);
    return firstTwo + masked;
}
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem("userEmail");
    const displayOldEmail = document.getElementById('current-email');

    fetch(`/api/user/${email}`)
        .then(res => res.json())
        .then(user => {
            if (displayOldEmail && user.email) {
                displayOldEmail.innerText = maskEmail(user.email);
            }
        });
});

function otp_email() {
    const newEmailInput = document.getElementById('new-email');
    const newEmail = newEmailInput.value.trim();
    const oldEmail = localStorage.getItem("userEmail");

    if (!newEmail) {
        alert("กรุณากรอก Email ใหม่");
        return;
    }

    if (newEmail === oldEmail) {
        alert("Email ใหม่ต้องไม่ซ้ำกับของเดิม");
        return;
    }

    fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: oldEmail })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("ส่ง OTP แล้ว");
            document.getElementById('otp-modal').style.display = 'flex';
        } else {
            alert("ส่ง OTP ไม่สำเร็จ");
        }
    });
}
function verifyOtp() {
    const otpValue = document.getElementById('otp-input').value.trim();
    const newEmail = document.getElementById('new-email').value.trim();
    const oldEmail = localStorage.getItem("userEmail");
    
    if (!newEmail) {
    alert("กรุณากรอก Email ใหม่");
    return;
    }
    if (!otpValue) {
        alert("กรุณากรอก OTP");
        return;
    }

    fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: oldEmail, otp: otpValue })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            fetch('/api/update-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldEmail, newEmail })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    localStorage.setItem("userEmail", newEmail);
                    alert("เปลี่ยน Email สำเร็จ");
                    window.location.href = "../manage_user.html";
                } else {
                    alert("อัปเดต email ไม่สำเร็จ");
                }
            });
        } else {
            alert("OTP ไม่ถูกต้อง");
        }
    });
}
