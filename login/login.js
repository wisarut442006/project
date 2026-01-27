function c_login(){
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
    }else {
        window.location.replace("../main/main.html");
    }

}