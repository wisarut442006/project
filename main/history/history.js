
function back(){
    window.location.href = "../main.html"
}
function opensetting() {
    document.getElementById("setting-dropdown").classList.toggle("show");
}

const userId = Number(localStorage.getItem("user_id"));

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("history-body");

  if (!tbody) {
    console.error("ไม่พบ history-body");
    return;
  }

  if (!userId) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">ไม่พบข้อมูลผู้ใช้</td>
      </tr>
    `;
    return;
  }

  fetch(`http://localhost:3000/notification-log/${userId}`)
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = "";

      if (!data || data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;">ยังไม่มีประวัติแจ้งเตือน</td>
          </tr>
        `;
        return;
      }

      data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.product_name || "-"}</td>
          <td>${item.message}</td>
          <td>${mapStatus(item.type)}</td>
          <td>${new Date(item.created_at).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">โหลดประวัติไม่สำเร็จ</td>
        </tr>
      `;
    });
});
function mapStatus(type) {
  const level = parseInt(type);

  if (level <= 0) {
    return `<span style="color:#dc3545; font-weight:bold;">หมดอายุแล้ว</span>`;
  }

  return `<span style="color:#ffc107;">ใกล้หมดอายุ (${level} วัน)</span>`;
}



// ลบประวัติทั้งหมด (soft delete)
function clearHistory() {
  if (!confirm("ต้องการลบประวัติทั้งหมดหรือไม่?")) return;

  fetch(`/notification-log/clear/${userId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    });
}
