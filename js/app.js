import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set, remove, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSvS5JvvgEdMru-T8XAoHPWIPkD8LEYfY",
  authDomain: "listadecompras-casa.firebaseapp.com",
  databaseURL: "https://listadecompras-casa-default-rtdb.firebaseio.com",
  projectId: "listadecompras-casa",
  storageBucket: "listadecompras-casa.firebasestorage.app",
  messagingSenderId: "400357716422",
  appId: "1:400357716422:web:94ab330545fa2eb65c02c7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

const loginDiv = document.getElementById('loginDiv');
const appDiv = document.getElementById('appDiv');
const loginError = document.getElementById('loginError');
const itemsList = document.getElementById('itemsList');

// Adiciona elemento para o contador
const counterElement = document.createElement('p');
counterElement.id = 'itemCounter';
itemsList.parentNode.insertBefore(counterElement, itemsList);

let userId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    loginDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
    loadItems();
  } else {
    userId = null;
    loginDiv.classList.remove('hidden');
    appDiv.classList.add('hidden');
    itemsList.innerHTML = '';
    counterElement.textContent = '';
  }
});

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => { loginError.textContent = ""; })
    .catch((error) => { loginError.textContent = "Erro: " + error.message; });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth);
});

document.getElementById('addBtn').addEventListener('click', () => {
  const nome = document.getElementById('itemInput').value;
  const qtd = document.getElementById('quantityInput').value;
  const unidade = document.getElementById('unitSelect').value;

  if (nome.trim() === '') return;

  const item = { nome, qtd, unidade, found: false };
  push(ref(db, 'compras/' + userId), item);

  document.getElementById('itemInput').value = '';
  document.getElementById('quantityInput').value = '1';
});
 
function loadItems() {
  const itemsRef = ref(db, 'compras/' + userId);
  onValue(itemsRef, (snapshot) => {
    itemsList.innerHTML = '';

    let itemCount = 0;
    let foundCount = 0;

    snapshot.forEach((childSnapshot) => {
      itemCount++;
      const item = childSnapshot.val();
      const key = childSnapshot.key;

      if (item.found) foundCount++;

      const li = document.createElement('li');
      li.className = item.found ? 'found' : '';

      const span = document.createElement('span');
      span.innerHTML = `
        <input type="checkbox" ${item.found ? 'checked' : ''} data-key="${key}">
        ${item.nome} (${item.qtd} ${item.unidade})
      `;

      const editBtn = document.createElement('button');
      editBtn.innerHTML = '<i class="bi-pencil"></i> Editar';
      editBtn.setAttribute('data-edit', key);

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '<i class="bi-trash"></i>';
      removeBtn.setAttribute('data-remove', key);

      // ✅ Envolver os botões num container flex
      const actionsDiv = document.createElement('div');
      actionsDiv.style.display = 'inline-flex';
      actionsDiv.style.gap = '5px'; // Espaço entre os botões
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(removeBtn);

      li.appendChild(span);
      li.appendChild(actionsDiv);  // ✅ Adiciona os dois botões agrupados
      itemsList.appendChild(li);
    });

    counterElement.textContent = `Total: ${itemCount} — Encontrados: ${foundCount}`;

    document.querySelectorAll('[data-key]').forEach(input => {
      input.addEventListener('change', (e) => {
        const key = e.target.getAttribute('data-key');
        update(ref(db, 'compras/' + userId + '/' + key), { found: e.target.checked });
      });
    });

    document.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-remove');
        remove(ref(db, 'compras/' + userId + '/' + key));
      });
    });

    document.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-edit');
        const li = btn.closest('li');
        const span = li.querySelector('span');

        const currentText = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.width = '70%';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Salvar';

        span.style.display = 'none';
        btn.style.display = 'none';
        li.insertBefore(input, li.querySelector('div'));
        li.insertBefore(saveBtn, li.querySelector('div'));

        saveBtn.addEventListener('click', () => {
          const newValue = input.value.trim();
          if (newValue !== '') {
            const match = newValue.match(/^(.+?)\s*\(\s*(\d+)\s+(\w+)\s*\)$/);
            if (match) {
              const nome = match[1];
              const qtd = match[2];
              const unidade = match[3];

              update(ref(db, 'compras/' + userId + '/' + key), { nome, qtd, unidade });

              span.innerHTML = `
                <input type="checkbox" ${li.classList.contains('found') ? 'checked' : ''} data-key="${key}">
                ${nome} (${qtd} ${unidade})
              `;
            } else {
              update(ref(db, 'compras/' + userId + '/' + key), { nome: newValue });
              span.innerHTML = `
                <input type="checkbox" ${li.classList.contains('found') ? 'checked' : ''} data-key="${key}">
                ${newValue}
              `;
            }
          }
          input.remove();
          saveBtn.remove();
          span.style.display = 'inline';
          btn.style.display = 'inline';
        });
      });
    });
  });
}