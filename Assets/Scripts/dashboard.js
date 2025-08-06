const token = localStorage.getItem('token');
if (!token) {
  alert('Please login first!');
  window.location.href = 'login.html';
}

// Logout
async function logout() {
  const res = await fetch('basic-firewall-simulation-production.up.railway.app/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  localStorage.removeItem('token');
  window.location.href = 'index.html';
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

  const res = await fetch('basic-firewall-simulation-production.up.railway.app/api/v1/firewall/rules', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(rule)
  });

  const result = await res.json();
  if (res.ok) {
    document.getElementById('rule-form').reset();
    fetchRules();
  } else {
    alert(result.message);
  }
});

// Fetch Rules
async function fetchRules() {
  const res = await fetch('basic-firewall-simulation-production.up.railway.app/api/v1/firewall/rules', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  const list = document.getElementById('rule-list');
  list.innerHTML = '<h4>Firewall Rules</h4>';
  data.forEach(r => {
    list.innerHTML += `
      <div class="p-2 border mb-2 rounded bg-light">
        <strong>${r.protocol.toUpperCase()}</strong> |
        ${r.sourceIp} ➜ ${r.destIp}:${r.port} |
        <span class="${r.action === 'permit' ? 'text-success' : 'text-danger'}">${r.action}</span>
      </div>`;
  });
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

  const res = await fetch('basic-firewall-simulation-production.up.railway.app/api/v1/firewall/simulate', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(packet)
  });

  const result = await res.json();
  if (res.ok) {
    animatePacket(result.action);
  } else {
    alert(result.message);
  }
});

// Animate Packet
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

  // Remove packet & firewall animation after animation ends
  setTimeout(() => {
    packet.remove();
    firewall.classList.remove('open', 'blocked');
  }, 2500);
}


window.addEventListener('DOMContentLoaded', fetchRules);
