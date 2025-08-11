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

async function loadMessages(){
  try{
    const res = await fetch('/api/messages');
    const data = await res.json();
    data.forEach(m => addMessage(m.role === 'layler' ? 'Layler' : 'Du', m.text));
  }catch{}
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
loadMessages();

// Photo preview
const photoInput = document.getElementById('photoInput');
const gallery = document.getElementById('photoGallery');
async function uploadPhoto(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try{
        const res = await fetch('/api/photo', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({name:file.name, data: reader.result.split(',')[1]})
        });
        const data = await res.json();
        const img = document.createElement('img');
        img.src = data.url;
        img.alt = file.name;
        gallery.appendChild(img);
        resolve();
      }catch(err){reject(err);}
    };
    reader.readAsDataURL(file);
  });
}

photoInput?.addEventListener('change', e => {
  [...e.target.files].forEach(f => uploadPhoto(f));
});

async function loadPhotos(){
  try{
    const res = await fetch('/api/photos');
    const data = await res.json();
    data.forEach(name => {
      const img = document.createElement('img');
      img.src = '/uploads/' + name;
      img.alt = name;
      gallery.appendChild(img);
    });
  }catch{}
}
loadPhotos();

// Trust level logic
const trustLevel = document.getElementById('trustLevel');
const trustMinus = document.getElementById('trustMinus');
const trustPlus = document.getElementById('trustPlus');

async function loadTrust(){
  try{
    const res = await fetch('/api/trust');
    const data = await res.json();
    trustLevel.textContent = data.level;
  }catch{}
}

async function changeTrust(delta){
  try{
    const res = await fetch('/api/trust', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({delta})
    });
    const data = await res.json();
    trustLevel.textContent = data.level;
  }catch{}
}

trustMinus?.addEventListener('click', () => changeTrust(-1));
trustPlus?.addEventListener('click', () => changeTrust(1));
loadTrust();

// Memories
const memList = document.getElementById('memoryList');
const memName = document.getElementById('memName');
const memContent = document.getElementById('memContent');
const saveMemory = document.getElementById('saveMemory');

async function loadMemories(){
  try{
    const res = await fetch('/api/memories');
    const data = await res.json();
    memList.innerHTML = '';
    data.forEach(m => {
      const div = document.createElement('div');
      div.textContent = `${m.name}: ${m.content}`;
      memList.appendChild(div);
    });
  }catch{}
}

async function sendMemory(){
  const name = memName.value.trim();
  const content = memContent.value.trim();
  if(!name || !content) return;
  try{
    await fetch('/api/memory', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name, content})
    });
    memName.value='';
    memContent.value='';
    loadMemories();
  }catch{}
}

saveMemory?.addEventListener('click', sendMemory);
loadMemories();
