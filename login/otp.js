function check_otp(){
    var otp = document.getElementById("OTP").value;
    var Pattern = /^[0-9]{6}/;
    if(otp == ""){
        alert("กรุณาใส่ OTP อีกครั้ง");
        return;
    }
    if(!Pattern.test(otp)){
        alert("ใส่ได้เพียงตัวเลข 0-9 กรุณาใส่ OTP อีกครั้ง");
        return;
    }
    window.location.href = "login.html";
}