// Tab navigation
const tabs = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.tab');
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    sections.forEach(s => s.hidden = true);
    document.getElementById(btn.dataset.tab).hidden = false;
  });
});

// Chat logic
const messages = document.getElementById('messages');
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(role, text){
  const div = document.createElement('div');
  div.textContent = `${role}: ${text}`;
  messages.appendChild(div);
}

async function sendMessage(){
  const text = input.value.trim();
  if(!text) return;
  addMessage('Du', text);
  input.value='';
  try{
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({message:text})
    });
    const data = await res.json();
    addMessage('Layler', data.reply);
  }catch(e){
    addMessage('System', 'Fehler beim Senden');
  }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if(e.key === 'Enter') sendMessage();
});

// Photo preview
const photoInput = document.getElementById('photoInput');
const gallery = document.getElementById('photoGallery');
photoInput?.addEventListener('change', e => {
  [...e.target.files].forEach(f => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    img.alt = f.name;
    gallery.appendChild(img);
  });
});
