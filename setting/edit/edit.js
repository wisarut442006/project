
document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
        alert("กรุณา login ก่อน");
        window.location.href = "/login/login.html";
        return;
    }

    fetch(`/api/user/${email}`)
        .then(res => res.json())
        .then(user => {
            const displayOldPassword = document.getElementById("current-password");
            const displayOldEmail = document.getElementById("current-email");
            const displayOldName = document.getElementById("current-username");

            if (displayOldPassword) displayOldPassword.innerText = user.password;
            if (displayOldEmail) displayOldEmail.innerText = user.email;
            if (displayOldName) displayOldName.innerText = user.username || "-";
        })
        .catch(err => console.error(err));
});


function closeOtpModal() {
    document.getElementById('otp-modal').style.display = 'none';
}