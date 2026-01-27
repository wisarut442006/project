function reset_password(){
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
    window.location.href = "login.html";
}