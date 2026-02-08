async function reset_password(){
    var email = document.getElementById("Email").value;
    var Pattern = /^[a-zA-Z0-9]+@gmail\.com/;
    if(email == ""){
        alert("กรุณากรอก Email");
        return;
    }
    if(!Pattern.test(email)) {
        alert("สามารถกรอกได้เเค่ a-z,A-Z,0-9@gmail.comเท่านั้น! กรุณาลองอีกครั้ง");
        return;
    }
    const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("otpMessage").innerText = `ระบบได้ส่งรหัสไปยัง ${email} แล้ว`;
        document.getElementById("otpModal").style.display = "block";
    } else {
        alert("ส่งรหัสไม่สำเร็จ กรุณาลองใหม่");
    }
}
   function closeModal() {
    document.getElementById("otpModal").style.display = "none";
}

async function verifyOTP() {
    var email = document.getElementById("Email").value;
    var otp = document.getElementById("otpInput").value;

    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById("otpModal").style.display = "none";
            document.getElementById("newPassModal").style.display = "block";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาดในการตรวจสอบรหัส");
    }
}
async function updatePassword() {
    var email = document.getElementById("Email").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmNewPassword = document.getElementById("confirmNewPassword").value;

    if (newPassword === "" || newPassword !== confirmNewPassword) {
        alert("รหัสผ่านไม่ตรงกันหรือไม่ครบถ้วน");
        return;
    }

    try {
        const response = await fetch('/api/update-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });

        const data = await response.json();
        if (data.success) {
            alert("เปลี่ยนรหัสผ่านสำเร็จ!");
            window.location.href = "login.html";
        } else {
            alert("ไม่สามารถเปลี่ยนรหัสผ่านได้");
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
}