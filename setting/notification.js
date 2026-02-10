async function confirm() {
  const userId = localStorage.getItem("user_id"); // ต้องมีตอน login

  const values = [];

  if (document.getElementById("noti_1month").checked) values.push(30);
  if (document.getElementById("noti_7day").checked) values.push(7);
  if (document.getElementById("noti_3day").checked) values.push(3);
  if (document.getElementById("noti_1day").checked) values.push(1);

  if (values.length === 0) {
    alert("กรุณาเลือกอย่างน้อย 1 รายการ");
    return;
  }

  const maxDay = Math.max(...values);

  await fetch("http://localhost:3000/api/save-notification-setting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      days: maxDay,
    }),
  });

  alert("บันทึกสำเร็จ");
  window.location.href = "../main/main.html";
}
async function loadSetting() {
  const userId = localStorage.getItem("user_id");
  const res = await fetch(`http://localhost:3000/api/notification-setting/${userId}`);
  const data = await res.json();

  const day = data.days;

  document.getElementById("noti_1month").checked = false;
  document.getElementById("noti_7day").checked = false;
  document.getElementById("noti_3day").checked = false;
  document.getElementById("noti_1day").checked = false;

  if (day === 30) document.getElementById("noti_1month").checked = true;
  else if (day === 7) document.getElementById("noti_7day").checked = true;
  else if (day === 3) document.getElementById("noti_3day").checked = true;
  else if (day === 1) document.getElementById("noti_1day").checked = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(
    "#noti_1month, #noti_7day, #noti_3day, #noti_1day"
  );

  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
    });
  });

  loadSetting(); // ของเดิม
});
fetch("/add-notification-log", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    user_id: userId,
    product_id: productId,
    message: "สินค้ากำลังจะหมดอายุ",
    type: "expire"
  })
});



function btnback() {
  window.location.href = "../main/main.html";
}
