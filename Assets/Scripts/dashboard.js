const BASE_URL = 'https://basic-firewall-simulation-production.up.railway.app/api/v1';
const token = localStorage.getItem('token');

if (!token) {
  alert('Please login first!');
  window.location.href = 'login.html';
}

// Logout
async function logout() {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Logout Error:', err);
  } finally {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// Add Rule
document.getElementById('rule-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rule = {
    protocol: document.getElementById('protocol').value.trim(),
    sourceIp: document.getElementById('source-ip').value.trim(),
    destIp: document.getElementById('dest-ip').value.trim(),
    port: parseInt(document.getElementById('port').value),
    action: document.getElementById('action').value
  };

  try {
    const res = await fetch(`${BASE_URL}/firewall/rules`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rule)
    });

    const result = await res.json();
    if (!res.ok) return alert(result.message);
    document.getElementById('rule-form').reset();
    fetchRules();
  } catch (err) {
    alert('Error adding rule');
  }
});

// Fetch Rules
async function fetchRules() {
  try {
    const res = await fetch(`${BASE_URL}/firewall/rules`, {
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    const list = document.getElementById('rule-list');
    list.innerHTML = '<h4>Firewall Rules</h4>';

    data.forEach(r => {
      list.innerHTML += `
        <div class="p-2 border mb-2 rounded bg-light d-flex justify-content-between align-items-center">
          <div>
            <strong>${r.protocol.toUpperCase()}</strong> |
            ${r.sourceIp} ➜ ${r.destIp}:${r.port} |
            <span class="${r.action === 'permit' ? 'text-success' : 'text-danger'}">${r.action}</span>
          </div>
          <button class="btn btn-sm btn-danger" onclick="deleteRule('${r._id}')">Delete</button>
        </div>
      `;
    });

  } catch (err) {
    alert('Failed to fetch rules');
  }
}

// Delete Rule
async function deleteRule(id) {
  if (!confirm('Are you sure you want to delete this rule?')) return;

  try {
    const res = await fetch(`${BASE_URL}/firewall/rules/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await res.json();
    if (!res.ok) return alert(result.message);
    fetchRules();
  } catch (err) {
    alert('Error deleting rule');
  }
}

// Simulate Packet
document.getElementById('packet-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const packet = {
    protocol: document.getElementById('packet-protocol').value.trim(),
    sourceIp: document.getElementById('packet-source').value.trim(),
    destIp: document.getElementById('packet-dest').value.trim(),
    port: parseInt(document.getElementById('packet-port').value)
  };

  try {
    const res = await fetch(`${BASE_URL}/firewall/simulate`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(packet)
    });

    const result = await res.json();
    if (!res.ok) return alert(result.message);

    animatePacket(result.action);
  } catch (err) {
    alert('Error simulating packet');
  }
});

//  Animate Packet
function animatePacket(action) {
  const packet = document.createElement('div');
  packet.className = 'packet-ball';

  const simulationArea = document.getElementById('simulation-area');
  const firewall = document.getElementById('firewall');

  simulationArea.appendChild(packet);

  if (action === 'permit') {
    packet.classList.add('permit');
    firewall.classList.add('open');
  } else {
    packet.classList.add('deny');
    firewall.classList.add('blocked');
  }

  setTimeout(() => {
    packet.remove();
    firewall.classList.remove('open', 'blocked');
  }, 2500);
}

window.addEventListener('DOMContentLoaded', fetchRules);
