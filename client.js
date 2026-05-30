const socket = io();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const statusEl = document.getElementById('status');
const chatEl = document.getElementById('chat');
const nameEl = document.getElementById('name');
const msgEl = document.getElementById('msg');

let myId = null;
let players = {};
let me = { x: 100, y: 100, color: '#7c5cff', name: 'Player' };

socket.on('connect', () => {
  statusEl.textContent = 'Connected';
  myId = socket.id;
});

socket.on('state', (state) => {
  players = state.players;
});

socket.on('chat', (data) => {
  const line = document.createElement('div');
  line.textContent = `${data.name}: ${data.msg}`;
  chatEl.appendChild(line);
  chatEl.scrollTop = chatEl.scrollHeight;
});

document.getElementById('join').onclick = () => {
  me.name = nameEl.value.trim() || 'Player';
  socket.emit('join', me.name);
};

document.getElementById('send').onclick = () => {
  const msg = msgEl.value.trim();
  if (!msg) return;
  socket.emit('chat', { name: me.name, msg });
  msgEl.value = '';
};

window.addEventListener('keydown', (e) => {
  const step = 10;
  if (e.key === 'ArrowUp' || e.key === 'w') me.y -= step;
  if (e.key === 'ArrowDown' || e.key === 's') me.y += step;
  if (e.key === 'ArrowLeft' || e.key === 'a') me.x -= step;
  if (e.key === 'ArrowRight' || e.key === 'd') me.x += step;
  socket.emit('move', me);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1d2340';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = p.color || '#fff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText(p.name || 'Player', p.x - 20, p.y - 26);
  }

  requestAnimationFrame(draw);
}
draw();
