async function Check(){
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var confirmpassword = document.getElementById("ConfirmPassword").value;
    var Pattern = /^[a-zA-Z0-9]+@gmail\.com/;
    if(email == ""){
        alert("กรุณากรอก ที่อยู่ Email")
        return;
    }
     if(!Pattern.test(email)) {
        alert("สามารถกรอกได้เเค่ a-z,A-Z,0-9@gmail.comเท่านั้น! กรุณาลองอีกครั้ง");
        return;
    }
    if(password == ""){
        alert("กรุณากรอกรหัสผ่าน");
        return ;
    }
    if(password != confirmpassword){
        alert("รหัสผ่านไม่ตรงกัน");
        return ;
    }
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = "login.html"; // ย้ายหน้าเมื่อบันทึกสำเร็จ
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("ไม่สามารถติดต่อ Server ได้");
    }
}
