// ===== UTILS =====
function formatPrice(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }
function getWish() { return JSON.parse(localStorage.getItem('wish') || '[]'); }
function catName(c) { return {badiiy:'Badiiy adabiyot',ilmiy:'Ilmiy adabiyot',bolalar:'Bolalar adabiyoti',tarix:'Tarix',biznes:'Biznes',chet:'Chet til'}[c]||c; }
function langName(l) { return {uz:"O'zbek",ru:"Rus",en:"Ingliz"}[l]||l; }

function updateCounts() {
  const cart = getCart();
  const wish = getWish();
  const cc = cart.reduce((s,b)=>s+b.qty,0);
  document.querySelectorAll('#cartCount').forEach(el=>el.textContent=cc);
  document.querySelectorAll('#wishCount').forEach(el=>el.textContent=wish.length);
}

function showToast(id) {
  const t = document.getElementById(id);
  if(!t) return;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

// ===== BOOK CARD =====
function bookCard(b) {
  const wish = getWish();
  const isWished = wish.includes(b.id);
  const disc = b.discount ? `<span class="disc-badge">-${b.discount}%</span>` : '';
  const newBadge = b.isNew ? '<span class="new-badge">Yangi</span>' : '';
  const stars = '★'.repeat(b.rating||4)+'☆'.repeat(5-(b.rating||4));
  return `
  <div class="book-card">
    <a href="book.html?id=${b.id}" class="book-card-img-link">
      <div class="book-card-cover" style="background:${b.color||'#4a90d9'}">
        <span class="book-emoji">${b.emoji||'📖'}</span>
        <div class="book-cover-overlay">${b.title}</div>
      </div>
      ${disc}${newBadge}
    </a>
    <button class="wish-btn${isWished?' wished':''}" onclick="toggleWishCard(${b.id},this)">${isWished?'❤️':'♡'}</button>
    <div class="book-card-body">
      <p class="book-cat-label">${catName(b.category)}</p>
      <a href="book.html?id=${b.id}"><h4>${b.title}</h4></a>
      <p class="book-author-sm">${b.author}</p>
      <div class="book-stars">${stars}</div>
      <div class="book-price-row">
        <span class="book-price">${formatPrice(b.price)} <small>so'm</small></span>
        ${b.stock===0?'<span class="out-stock">Tugagan</span>':''}
      </div>
      <button class="btn-cart-sm" onclick="addToCart(${b.id})" ${b.stock===0?'disabled':''}>
        ${b.stock>0?'🛒 Savatga':'Mavjud emas'}
      </button>
    </div>
  </div>`;
}

// ===== CART ACTIONS =====
function addToCart(id) {
  const b = books.find(x=>x.id===id);
  if(!b || b.stock===0) return;
  const cart = getCart();
  const ex = cart.find(x=>x.id===id);
  if(ex) ex.qty++; else cart.push({...b, qty:1});
  saveCart(cart);
  updateCounts();
  showToast('cartToast');
}

function toggleWishCard(id, btn) {
  let wish = getWish();
  if(wish.includes(id)) {
    wish = wish.filter(x=>x!==id);
    btn.textContent = '♡'; btn.classList.remove('wished');
  } else {
    wish.push(id);
    btn.textContent = '❤️'; btn.classList.add('wished');
    showToast('wishToast');
  }
  localStorage.setItem('wish', JSON.stringify(wish));
  updateCounts();
}

// ===== SEARCH =====
function doSearch() {
  const q = document.getElementById('searchInput').value.trim();
  if(q) window.location.href = 'catalog.html?q=' + encodeURIComponent(q);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const inp = document.getElementById('searchInput');
  const dd = document.getElementById('searchDropdown');
  if(!inp || !dd) return;

  // URL search param
  const urlQ = new URLSearchParams(location.search).get('q');
  if(urlQ) inp.value = urlQ;

  inp.addEventListener('keydown', e=>{ if(e.key==='Enter') doSearch(); });
  inp.addEventListener('input', ()=>{
    const q = inp.value.trim().toLowerCase();
    if(q.length < 2) { dd.style.display='none'; return; }
    const res = books.filter(b=>b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q)).slice(0,6);
    if(!res.length) { dd.style.display='none'; return; }
    dd.innerHTML = res.map(b=>`<a class="sd-item" href="book.html?id=${b.id}">
      <span style="background:${b.color};padding:4px 8px;border-radius:4px;color:white;font-size:12px">${b.emoji}</span>
      <div><strong>${b.title}</strong><small>${b.author}</small></div>
      <span>${formatPrice(b.price)} so'm</span>
    </a>`).join('');
    dd.style.display='block';
  });
  document.addEventListener('click', e=>{ if(!e.target.closest('.search-box')) dd.style.display='none'; });
});

// ===== HEADER SCROLL =====
window.addEventListener('scroll', ()=>{
  document.getElementById('header').classList.toggle('scrolled', window.scrollY>50);
});

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
