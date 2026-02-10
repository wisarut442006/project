document.addEventListener('DOMContentLoaded', () => {
    const displayOldName = document.getElementById('current-username');
    if (displayOldName) {
        displayOldName.innerText = localStorage.getItem("username");
    }
});
function userUpdate() {
    const newNameInput = document.getElementById('new-username');
    const newUsername = newNameInput.value.trim();
    const id = localStorage.getItem("user_id");

    if (!newUsername) {
        alert("กรุณากรอกชื่อผู้ใช้ใหม่");
        return;
    }

    fetch('/api/update-user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            username: newUsername
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("username", newUsername);
            alert("อัปเดตสำเร็จ");
            window.location.href = "../manage_user.html";
        } else {
            alert("อัปเดตไม่สำเร็จ");
        }
    });
}
