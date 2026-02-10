async function loadUsers() {
  const res = await fetch('/api/admin/users');
  const users = await res.json();

  const table = document.getElementById('userTable');
  table.innerHTML = '';

  users.forEach(u => {
    table.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.username || '-'}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
            <span class="status ${u.status}">
            <span class="dot"></span>
             ${u.status}
            </span>
        </td>
        <td>
          ${u.role === 'admin'
            ? '<span>-</span>'
            : u.status === 'active'
              ? `<button class="btn-ban" onclick="banUser(${u.id})">Ban</button>`
              : `<button class="btn-unban" onclick="unbanUser(${u.id})">Unban</button>`
          }
        </td>
      </tr>
    `;
  });
}


async function banUser(id) {
  if (!confirm('Ban user นี้?')) return;
  await fetch(`/api/admin/ban-user/${id}`, { method: 'PUT' });
  loadUsers();
}

async function unbanUser(id) {
  await fetch(`/api/admin/unban-user/${id}`, { method: 'PUT' });
  loadUsers();
}

loadUsers();