const SEED_BOOKS = [
  {id:'refactor-repeat', no:'005.1 VOS', title:'Refactor & Repeat', author:'M. Voss', price:24, color:'#4F46E5', tags:['refactoring','legacy code'], desc:'A field guide to untangling legacy systems one small, safe commit at a time.'},
  {id:'concurrency-notebook', no:'005.1 KHA', title:'The Concurrency Notebook', author:'R. Khatri', price:29, color:'#0EA5E9', tags:['async','threads'], desc:'Notes on races, deadlocks, and the mental models that keep concurrent code sane.'},
  {id:'systems-below-fold', no:'004.6 OYE', title:'Systems Below the Fold', author:'D. Oyelaran', price:32, color:'#10B981', tags:['distributed systems'], desc:'What actually happens between the request and response across distributed nodes.'},
  {id:'typed-true', no:'005.1 FEN', title:'Typed & True', author:'S. Fenwick', price:22, color:'#8B5CF6', tags:['typescript','types'], desc:'Using a type system as a design tool, not just a linter with opinions.'},
  {id:'query-craft', no:'005.7 NAS', title:'Query Craft', author:'I. Nasser', price:26, color:'#F59E0B', tags:['sql','databases'], desc:'Schema design and query patterns that hold up once real users show up.'},
  {id:'container-almanac', no:'004.2 PRK', title:'The Container Almanac', author:'L. Park', price:28, color:'#EC4899', tags:['docker','kubernetes'], desc:'A season-by-season guide to running containers without losing weekends.'},
  {id:'clean-terminal', no:'004.2 ABE', title:'Clean Terminal', author:'T. Abernathy', price:19, color:'#F97316', tags:['cli','shell'], desc:'Small, composable shell habits for people who live in the terminal.'},
  {id:'algorithms-scale', no:'005.1 CHU', title:'Algorithms at Scale', author:'W. Chu', price:34, color:'#14B8A6', tags:['algorithms','performance'], desc:"What changes about your favorite algorithms once N stops being small."},
  {id:'api-field-guide', no:'005.3 MOR', title:'The API Field Guide', author:'C. Moreau', price:23, color:'#A855F7', tags:['rest','graphql','api design'], desc:'Designing interfaces that are still pleasant to use two years and four teams later.'}
];


let BOOKS = [...SEED_BOOKS];
let ALL_TAGS = ['all', ...new Set(BOOKS.flatMap(b => b.tags))];
let catalogOverrides = {customBooks:{}, edits:{}, deletedIds:[]};
const CATALOG_OVERRIDES_KEY = 'nodelib-catalog-overrides';

function rebuildBooks(){
  const kept = SEED_BOOKS
    .filter(b => !catalogOverrides.deletedIds.includes(b.id))
    .map(b => ({...b, ...(catalogOverrides.edits[b.id] || {})}));
  const custom = Object.values(catalogOverrides.customBooks);
  BOOKS = [...kept, ...custom];
  ALL_TAGS = ['all', ...new Set(BOOKS.flatMap(b => b.tags))];
  renderFilters();
  renderCatalog();
  renderCart();
  const libView = document.getElementById('view-library');
  if(libView && libView.style.display !== 'none') renderLibrary();
}
async function loadCatalogOverrides(){
  try{
    const res = await window.storage.get(CATALOG_OVERRIDES_KEY, true);
    if(res && res.value){
      const data = JSON.parse(res.value);
      catalogOverrides = {
        customBooks: data.customBooks || {},
        edits: data.edits || {},
        deletedIds: data.deletedIds || []
      };
    }
  }catch(e){
    // No shared catalog overrides saved yet — start with the default nine books.
  }
}
async function saveCatalogOverrides(){
  try{
    await window.storage.set(CATALOG_OVERRIDES_KEY, JSON.stringify(catalogOverrides), true);
  }catch(e){
    console.error('Could not save catalog overrides', e);
    showToast('Could not save catalog changes.');
  }
}
let currentUser = null;
let cart = [];
let library = [];
let activeFilter = 'all';
let selectedPayment = 'razorpay';
let adminUnlocked = false;
let adminEditingId = null;
const ADMIN_PASSCODE = 'admin123';
const ADMIN_SWATCHES = ['#4F46E5','#0EA5E9','#10B981','#8B5CF6','#F59E0B','#EC4899','#F97316','#14B8A6','#A855F7'];
const STATE_KEY = 'nodelib-state';

function initials(title){ return title.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase(); }
async function loadState(){
  try{
    const res = await window.storage.get(STATE_KEY, false);
    if(res && res.value){
      const data = JSON.parse(res.value);
      currentUser = data.currentUser || null;
      cart = data.cart || [];
      library = data.library || [];
    }
  }catch(e){
    // No saved state yet for this browser — start with defaults.
  }
}
async function saveState(){
  try{
    await window.storage.set(STATE_KEY, JSON.stringify({currentUser, cart, library}), false);
  }catch(e){
    console.error('Could not save NodeLib state', e);
  }
}
function renderUser(){
  document.getElementById('userChip').textContent = currentUser ? currentUser.email : '';
  document.getElementById('authBtn').textContent = currentUser ? 'Sign out' : 'Sign in';
}
function renderFilters(){
  document.getElementById('filterBar').innerHTML = ALL_TAGS.map(t =>
    `<button class="filter-chip ${t===activeFilter?'active':''}" onclick="setFilter('${t}')">${t}</button>`).join('');
}
function setFilter(t){ activeFilter=t; renderFilters(); renderCatalog(); }
function renderCatalog(){
  const grid=document.getElementById('catalogGrid');
  const books=activeFilter==='all'?BOOKS:BOOKS.filter(b=>b.tags.includes(activeFilter));
  grid.innerHTML=books.map(b=>{
    const owned=library.includes(b.id), inCart=cart.includes(b.id);
    return `<div class="card" onclick="openProductPage('${b.id}')">
      <div class="card-top"><span class="catalog-no">NO. ${b.no}</span><span class="profile-pill">View →</span></div>
      <div class="cover" style="background:${b.color}">${initials(b.title)}</div>
      <h3>${b.title}</h3><div class="author">by ${b.author}</div>
      <div class="desc">${b.desc}</div>
      <div class="tags">${b.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="card-foot" onclick="event.stopPropagation()">
        <span class="price">$${b.price}</span>
        ${owned?`<button class="add-btn owned">In Library ✓</button>`:
          `<button class="add-btn" onclick="addToCart('${b.id}')">${inCart?'In Cart':'Add to Cart'}</button>`}
      </div>
    </div>`;
  }).join('');
}
function openProductPage(id){
  const b=BOOKS.find(x=>x.id===id); if(!b)return;
  document.getElementById('heroSection').style.display='none';
  document.getElementById('view-catalog').style.display='none';
  document.getElementById('productDetailPage').style.display='block';
  document.getElementById('detailCover').style.background=b.color;
  document.getElementById('detailCover').textContent=initials(b.title);
  document.getElementById('detailCatalogNo').textContent='NO. '+b.no;
  document.getElementById('detailPageTitle').textContent=b.title;
  document.getElementById('detailPageAuthor').textContent='BY '+b.author.toUpperCase();
  document.getElementById('detailPageTags').innerHTML=b.tags.map(t=>`<span class="tag">${t}</span>`).join('');
  document.getElementById('detailPageDesc').textContent=b.desc;
  document.getElementById('detailPagePrice').textContent='$'+b.price;
  document.getElementById('detailCartBtn').textContent=cart.includes(b.id)?'Already in cart':'Add to cart';
  document.getElementById('detailCartBtn').onclick=()=>addToCart(b.id);
  document.getElementById('detailBuyBtn').onclick=()=>startSingleCheckout(b.id);
  window.scrollTo({top:0,behavior:'smooth'});
}
function backToCatalog(){
  document.getElementById('productDetailPage').style.display='none';
  setView('catalog');
}
function addToCart(id){
  if(!cart.includes(id)) cart.push(id);
  saveState(); renderCart(); renderCatalog();
  const btn=document.getElementById('detailCartBtn'); if(btn)btn.textContent='Already in cart';
  showToast('Item added to cart');
}
function removeFromCart(id){
  cart=cart.filter(x=>x!==id); saveState(); renderCart(); renderCatalog();
}
function renderCart(){
  document.getElementById('cartCount').textContent=cart.length;
  const items=document.getElementById('cartItems');
  const cartBooks=cart.map(id=>BOOKS.find(b=>b.id===id)).filter(Boolean);
  items.innerHTML=cartBooks.length?cartBooks.map(b=>`
    <div class="cart-item">
      <div class="ci-cover" style="background:${b.color}">${initials(b.title)}</div>
      <div style="flex:1"><h4 style="font-size:14px;">${b.title}</h4>
      <div style="font-family:var(--font-mono);font-size:13px;font-weight:700;margin-top:4px;">$${b.price}</div></div>
      <button class="close-x" onclick="removeFromCart('${b.id}')">×</button>
    </div>`).join(''):`<p style="color:var(--text-muted);">Your cart is empty.</p>`;
  const total=cartBooks.reduce((s,b)=>s+b.price,0);
  document.getElementById('cartTotal').textContent='$'+total;
}
function openCart(){document.getElementById('cartPanel').classList.add('show');}
function closeCart(){document.getElementById('cartPanel').classList.remove('show');}

function openAuthModal(){
  if(currentUser){
    if(confirm('Sign out from '+currentUser.email+'?')){
      currentUser=null; saveState(); renderUser(); showToast('Signed out successfully.');
    }
    return;
  }
  setAuthMode('signin');
  document.getElementById('authOverlay').classList.add('show');
}
function closeModal(id){document.getElementById(id).classList.remove('show');}
function setAuthMode(mode){
  document.getElementById('tabSignin').classList.toggle('active',mode==='signin');
  document.getElementById('tabSignup').classList.toggle('active',mode==='signup');
  document.getElementById('nameGroup').classList.toggle('hidden',mode==='signin');
  document.getElementById('btnText').textContent=mode==='signin'?'Sign In':'Create Account';
  document.getElementById('authForm').dataset.mode=mode;
  document.getElementById('alertBox').className='alert-message';
  document.getElementById('alertBox').textContent='';
}
function togglePasswordVisibility(){
  const i=document.getElementById('authPass'); i.type=i.type==='password'?'text':'password';
}
function handleAuthSubmit(){
  const email=document.getElementById('authEmail').value.trim().toLowerCase();
  const pass=document.getElementById('authPass').value;
  const name=document.getElementById('authName').value.trim();
  const mode=document.getElementById('authForm').dataset.mode||'signin';
  if(!email || !email.includes('@')){return showAuthAlert('Please enter a valid email address.','error');}
  if(pass.length<6){return showAuthAlert('Password must contain at least 6 characters.','error');}
  if(mode==='signup' && !name){return showAuthAlert('Please enter your full name.','error');}
  currentUser={email,name:name||email.split('@')[0]};
  saveState(); renderUser(); closeModal('authOverlay'); showToast(mode==='signup'?'Account created successfully.':'Welcome back, '+currentUser.name+'!');
}
function showAuthAlert(msg,type){const a=document.getElementById('alertBox');a.textContent=msg;a.className='alert-message '+type;}

function beginCheckout(){
  if(!cart.length)return showToast('Cart is empty.');
  if(!currentUser){closeCart();openAuthModal();return;}
  openCheckout(cart);
}
function startSingleCheckout(id){
  if(!currentUser){openAuthModal();showToast('Please sign in before checkout.');return;}
  openCheckout([id]);
}
function openCheckout(ids){
  const books=ids.map(id=>BOOKS.find(b=>b.id===id)).filter(Boolean);
  document.getElementById('checkoutBody').innerHTML=books.map(b=>
    `<div style="display:flex;justify-content:space-between;margin:8px 0;"><span>${b.title}</span><strong>$${b.price}</strong></div>`).join('');
  const total=books.reduce((s,b)=>s+b.price,0);
  document.getElementById('checkoutSubtotal').textContent='$'+total;
  document.getElementById('checkoutTotal').textContent='$'+total;
  document.getElementById('checkoutOverlay').dataset.ids=JSON.stringify(ids);
  document.getElementById('checkoutOverlay').classList.add('show');
}
function selectPayment(method){
  selectedPayment=method;
  document.querySelectorAll('.payment-option').forEach(x=>x.classList.toggle('active',x.dataset.method===method));
}
function payNow(){
  const overlay=document.getElementById('checkoutOverlay');
  const ids=JSON.parse(overlay.dataset.ids||'[]');
  if(!ids.length)return;
  /*
    REAL GATEWAY INTEGRATION:
    Replace this demo branch with Razorpay Checkout after creating an order
    on your backend and verifying the payment signature server-side.
    Never put your Razorpay secret key in this HTML file.
  */
  const total=ids.map(id=>BOOKS.find(b=>b.id===id)?.price||0).reduce((a,b)=>a+b,0);
  const method=selectedPayment.toUpperCase();
  if(!currentUser){closeModal('checkoutOverlay');openAuthModal();return;}
  library=[...new Set([...library,...ids])];
  cart=cart.filter(id=>!ids.includes(id));
  saveState(); renderCart(); renderCatalog(); closeModal('checkoutOverlay'); closeCart();
  showToast(`Demo ${method} payment successful — $${total} paid.`);
}
function setView(view){
  ['catalog','library','about','faq','contact','admin'].forEach(v=>{
    const el=document.getElementById('view-'+v); if(el)el.style.display=v===view?'block':'none';
  });
  document.getElementById('productDetailPage').style.display='none';
  document.getElementById('heroSection').style.display=view==='catalog'?'block':'none';
  document.querySelectorAll('.navlink').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  if(view==='library')renderLibrary();
  if(view==='admin')renderAdmin();
}
function renderLibrary(){
  const c=document.getElementById('libraryContent');
  const books=library.map(id=>BOOKS.find(b=>b.id===id)).filter(Boolean);
  c.innerHTML=books.length?`<div class="catalog-grid">${books.map(b=>`
    <div class="card" onclick="openProductPage('${b.id}')">
      <div class="cover" style="background:${b.color}">${initials(b.title)}</div>
      <h3>${b.title}</h3><div class="author">by ${b.author}</div>
      <div class="desc">${b.desc}</div><button class="btn btn-primary">Open details →</button>
    </div>`).join('')}</div>`:
    `<div class="drawer-card"><h3>Your library is empty</h3><p style="color:var(--text-muted);margin-top:8px;">Purchase an item to unlock it here.</p><button class="btn btn-primary" style="margin-top:18px;" onclick="setView('catalog')">Browse catalog</button></div>`;
}
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

/* =========================================================
   ADMIN DASHBOARD — add / edit / delete catalog items
   ========================================================= */
function renderAdmin(){
  const el = document.getElementById('adminContent');
  if(!el) return;
  if(!adminUnlocked){
    el.innerHTML = `
      <div class="section-head"><h2>Admin dashboard</h2></div>
      <div class="drawer-card" style="max-width:420px;">
        <div class="drawer-title">Restricted area</div>
        <p style="color:var(--text-muted); font-size:14px; line-height:1.6; margin-bottom:18px;">
          This gates casual clicking only — it's a client-side demo check, not real
          authentication. A production dashboard needs a real login behind a real backend.
        </p>
        <label for="adminPasscodeInput">Passcode</label>
        <input type="password" id="adminPasscodeInput" placeholder="demo passcode: admin123" onkeydown="if(event.key==='Enter')tryAdminUnlock()">
        <button class="btn btn-primary" style="width:100%; margin-top:16px;" onclick="tryAdminUnlock()">Enter dashboard</button>
      </div>`;
    return;
  }
  const rows = BOOKS.map(b=>{
    const isSeed = SEED_BOOKS.some(s=>s.id===b.id);
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;flex-shrink:0;border-radius:9px;background:${b.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px;">${initials(b.title)}</div>
          <div>
            <div style="font-weight:700;font-size:13.5px;">${b.title}</div>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">${b.no||'—'}</div>
          </div>
        </div>
      </td>
      <td>${b.author}</td>
      <td style="font-family:var(--font-mono);font-weight:700;">$${b.price}</td>
      <td>${b.tags.map(t=>`<span class="tag">${t}</span>`).join(' ')}</td>
      <td><span class="profile-pill">${isSeed ? 'seed' : 'custom'}</span></td>
      <td style="white-space:nowrap;">
        <button class="btn btn-ghost admin-row-btn" onclick="openAdminForm('${b.id}')">Edit</button>
        <button class="btn btn-ghost admin-row-btn admin-row-btn-danger" onclick="deleteAdminBook('${b.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
  el.innerHTML = `
    <div class="section-head">
      <h2>Admin dashboard</h2>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-ghost" onclick="resetCatalogOverrides()">Reset to defaults</button>
        <button class="btn btn-primary" onclick="openAdminForm(null)">+ Add new book</button>
      </div>
    </div>
    <p style="color:var(--text-muted); font-size:13px; margin-bottom:20px;">
      Changes here are saved to shared storage — every visitor to this page sees the same catalog you set up.
    </p>
    <div class="drawer-card" style="overflow-x:auto; padding:12px;">
      <table class="admin-table">
        <thead><tr>
          <th>Book</th><th>Author</th><th>Price</th><th>Tags</th><th>Source</th><th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
function tryAdminUnlock(){
  const input = document.getElementById('adminPasscodeInput');
  if(input && input.value === ADMIN_PASSCODE){
    adminUnlocked = true;
    renderAdmin();
    showToast('Admin dashboard unlocked.');
  } else {
    showToast('Incorrect passcode.');
  }
}
function renderAdminSwatches(selected){
  const wrap = document.getElementById('adminColorSwatches');
  if(!wrap) return;
  wrap.innerHTML = ADMIN_SWATCHES.map(c=>
    `<button type="button" onclick="pickAdminColor('${c}')" style="width:28px;height:28px;border-radius:8px;background:${c};border:2px solid ${c===selected?'#101828':'transparent'};cursor:pointer;"></button>`
  ).join('');
}
function pickAdminColor(c){
  document.getElementById('adminColor').value = c;
  renderAdminSwatches(c);
}
function slugify(str){
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'book';
}
function openAdminForm(id){
  adminEditingId = id;
  const b = id ? BOOKS.find(x=>x.id===id) : null;
  document.getElementById('adminFormTitle').textContent = id ? 'Edit book' : 'Add new book';
  document.getElementById('adminTitle').value = b ? b.title : '';
  document.getElementById('adminAuthor').value = b ? b.author : '';
  document.getElementById('adminPrice').value = b ? b.price : '';
  document.getElementById('adminNo').value = b ? (b.no || '') : '';
  document.getElementById('adminTags').value = b ? b.tags.join(', ') : '';
  document.getElementById('adminDesc').value = b ? b.desc : '';
  document.getElementById('adminColor').value = b ? b.color : ADMIN_SWATCHES[0];
  renderAdminSwatches(b ? b.color : ADMIN_SWATCHES[0]);
  document.getElementById('adminFormOverlay').classList.add('show');
}
function submitAdminForm(){
  const title = document.getElementById('adminTitle').value.trim();
  const author = document.getElementById('adminAuthor').value.trim();
  const price = parseFloat(document.getElementById('adminPrice').value);
  const no = document.getElementById('adminNo').value.trim() || '000.0 NEW';
  const tags = document.getElementById('adminTags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const desc = document.getElementById('adminDesc').value.trim();
  const color = document.getElementById('adminColor').value;
  if(!title || !author || isNaN(price) || price < 0 || tags.length === 0 || !desc){
    showToast('Fill in every field (including at least one tag) before saving.');
    return;
  }
  const bookData = {title, author, price, no, tags, desc, color};
  if(adminEditingId){
    const isSeed = SEED_BOOKS.some(s=>s.id===adminEditingId);
    if(isSeed){
      catalogOverrides.edits[adminEditingId] = bookData;
    } else {
      catalogOverrides.customBooks[adminEditingId] = {id: adminEditingId, ...bookData};
    }
  } else {
    const base = slugify(title);
    let uniqueId = base, n = 2;
    while(BOOKS.some(b=>b.id===uniqueId)){ uniqueId = base+'-'+n; n++; }
    catalogOverrides.customBooks[uniqueId] = {id: uniqueId, ...bookData};
  }
  saveCatalogOverrides();
  rebuildBooks();
  closeModal('adminFormOverlay');
  renderAdmin();
  showToast(adminEditingId ? 'Book updated.' : 'Book added to catalog.');
}
function deleteAdminBook(id){
  if(!confirm('Remove this book from the catalog for everyone?')) return;
  const isSeed = SEED_BOOKS.some(s=>s.id===id);
  if(isSeed){
    if(!catalogOverrides.deletedIds.includes(id)) catalogOverrides.deletedIds.push(id);
    delete catalogOverrides.edits[id];
  } else {
    delete catalogOverrides.customBooks[id];
  }
  saveCatalogOverrides();
  rebuildBooks();
  renderAdmin();
  showToast('Book removed from catalog.');
}
function resetCatalogOverrides(){
  if(!confirm('Reset the catalog to the default nine books? This clears every admin change for all visitors.')) return;
  catalogOverrides = {customBooks:{}, edits:{}, deletedIds:[]};
  saveCatalogOverrides();
  rebuildBooks();
  renderAdmin();
  showToast('Catalog reset to defaults.');
}

renderFilters(); renderCatalog(); renderCart(); renderUser(); setupScrollAnimations();
loadState().then(()=>{ renderCatalog(); renderCart(); renderUser(); });
loadCatalogOverrides().then(()=>{ rebuildBooks(); });


/* =========================================================
   SCROLL REVEAL ENGINE
   ========================================================= */
function setupScrollAnimations() {
  const selectors = [
    '#view-catalog .section-head',
    '#view-library .section-head',
    '#view-about .section-head',
    '#view-faq .section-head',
    '#view-contact .section-head',
    '#view-catalog .catalog-grid',
    '#view-library #libraryContent',
    '#view-about p',
    '#view-faq p',
    '#view-contact p',
    '#productDetailPage .product-detail-shell',
    'footer'
  ];

  document.querySelectorAll(selectors.join(',')).forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  // Card grids reveal their children one after another.
  document.querySelectorAll('.catalog-grid').forEach(grid => {
    grid.classList.add('stagger');
  });

  // Observe elements entering the viewport.
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -45px 0px'
  });

  document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

  // Header elevation while scrolling.
  const header = document.querySelector('header');
  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 18);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// Re-run reveal setup when catalog/library content changes.
const originalRenderCatalog = window.renderCatalog;
const originalRenderLibrary = window.renderLibrary;

window.renderCatalog = function() {
  originalRenderCatalog();
  requestAnimationFrame(setupScrollAnimations);
};

window.renderLibrary = function() {
  originalRenderLibrary();
  requestAnimationFrame(setupScrollAnimations);
};

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(setupScrollAnimations);
});


(function setupScrollProgress(){
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = progress + '%';
  };
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();