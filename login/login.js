async function c_login(){
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value
    var Pattern = /^[a-zA-Z0-9]+@gmail\.com/;
    if (email == "" || password == ""){
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }
     if(!Pattern.test(email)) {
        alert("สามารถกรอกได้เเค่ a-z,A-Z,0-9@gmail.comเท่านั้น! กรุณาลองอีกครั้ง");
        return;
    }
    try{
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        });
        const data = await response.json();

        if(data.success){
            localStorage.setItem('userRole',data.role);
            localStorage.setItem("userEmail",data.email);
            localStorage.setItem('user_id', data.user_id);
            if(data.role == 'admin'){
                alert("เข้าสู่ระบบฐานะ Admin");
                window.location.href = "../Admin/dashboard.html";
            }else{
                window.location.href = "../main/main.html";
            }
        }else{
            alert(data.message);
        }
    }catch (error){
        alert("ไม่สามารถติดต่อ Server ได้")
    }
}