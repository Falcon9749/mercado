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

  if(nome.trim() === '') return;

  const item = { nome, qtd, unidade, found: false };
  push(ref(db, 'compras/' + userId), item);
  document.getElementById('itemInput').value = '';
  document.getElementById('quantityInput').value = '1';
});

function loadItems() {
  const itemsRef = ref(db, 'compras/' + userId);
  onValue(itemsRef, (snapshot) => {
    itemsList.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      const key = childSnapshot.key;

      const li = document.createElement('li');
      li.className = item.found ? 'found' : '';
      li.innerHTML = `
        <span>
          <input type="checkbox" ${item.found ? 'checked' : ''} data-key="${key}">
          ${item.nome} (${item.qtd} ${item.unidade})
        </span>
        <button data-remove="${key}"><i class="fas fa-times"></i></button>
      `;
      itemsList.appendChild(li);
    });

    document.querySelectorAll('[data-key]').forEach(input => {
      input.addEventListener('change', (e) => {
        const key = e.target.getAttribute('data-key');
        update(ref(db, 'compras/' + userId + '/' + key), { found: e.target.checked });
      });
    });

    document.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.target.getAttribute('data-remove');
        remove(ref(db, 'compras/' + userId + '/' + key));
      });
    });
  });
}

document.getElementById('clearBtn').addEventListener('click', () => {
  remove(ref(db, 'compras/' + userId));
});
