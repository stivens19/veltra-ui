// VeltraUI POS (Point of Sale) Interactive Engine
export const POS_PRODUCTS = [
  {
    id: 'p1',
    name: 'Flat White Doble Shot',
    category: 'coffee',
    price: 4.50,
    stock: 34,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    name: 'Iced Caramel Macchiato',
    category: 'coffee',
    price: 5.20,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p3',
    name: 'Espresso Romano Single',
    category: 'coffee',
    price: 3.20,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    name: 'Matcha Ceremonial Latte',
    category: 'coffee',
    price: 5.80,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p5',
    name: 'Croissant Mantequilla',
    category: 'bakery',
    price: 3.50,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p6',
    name: 'Cheesecake Frutos Rojos',
    category: 'bakery',
    price: 5.50,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p7',
    name: 'Pain au Chocolat Belga',
    category: 'bakery',
    price: 4.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p8',
    name: 'Avocado Sourdough Toast',
    category: 'food',
    price: 7.50,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p9',
    name: 'Superfood Açaí Bowl',
    category: 'food',
    price: 6.80,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p10',
    name: 'Panini Caprese Prosciutto',
    category: 'food',
    price: 8.20,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p11',
    name: 'Kombucha Jengibre & Lima',
    category: 'drinks',
    price: 4.80,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'p12',
    name: 'Cold Brew Tonic & Romero',
    category: 'drinks',
    price: 5.00,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80'
  }
];

let cart = [
  { id: 'p1', name: 'Flat White Doble Shot', price: 4.50, qty: 2, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&auto=format&fit=crop&q=80' },
  { id: 'p5', name: 'Croissant Mantequilla', price: 3.50, qty: 1, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80' },
  { id: 'p6', name: 'Cheesecake Frutos Rojos', price: 5.50, qty: 1, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=80' }
];

let activeCategory = 'all';
let searchQuery = '';
let discountPercent = 0;

export function initPOS() {
  renderProducts();
  renderCart();
  setupEventListeners();
}

function renderProducts() {
  const container = document.getElementById('pos-products-grid');
  if (!container) return;

  const filtered = POS_PRODUCTS.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-12 p-8 text-center text-slate-400">
        <i data-lucide="package-search" class="w-10 h-10 mx-auto mb-2 text-slate-300"></i>
        <p class="text-xs font-semibold">No se encontraron productos en esta categoría.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="vlt-pos-product-card group" onclick="window.posAddToCart('${p.id}')">
      <div class="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-slate-200 border border-slate-200/50">
          Stock: ${p.stock}
        </span>
      </div>
      <div>
        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1 group-hover:text-cyan-600 transition-colors">${p.name}</h4>
        <div class="flex items-center justify-between mt-1.5">
          <span class="text-xs font-extrabold text-cyan-600 font-mono">$${p.price.toFixed(2)}</span>
          <span class="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center text-xs group-hover:bg-cyan-500 group-hover:text-white transition-colors">
            +
          </span>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderCart() {
  const container = document.getElementById('pos-cart-items');
  const countBadge = document.getElementById('pos-cart-count');
  const subtotalEl = document.getElementById('pos-subtotal');
  const taxEl = document.getElementById('pos-tax');
  const discountEl = document.getElementById('pos-discount');
  const totalEl = document.getElementById('pos-total');
  const payBtn = document.getElementById('pos-pay-btn');

  if (!container) return;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) countBadge.textContent = `${totalItems} items`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 my-auto">
        <i data-lucide="shopping-bag" class="w-10 h-10 mx-auto mb-2 text-slate-300"></i>
        <p class="text-xs font-bold text-slate-600">Ticket Vacío</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Toca o busca productos para agregarlos al pedido.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (taxEl) taxEl.textContent = '$0.00';
    if (discountEl) discountEl.textContent = '-$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    if (payBtn) {
      payBtn.textContent = 'COBRAR $0.00';
      payBtn.disabled = true;
    }
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal * discountPercent;
  const taxable = subtotal - discount;
  const tax = taxable * 0.18; // IGV 18%
  const total = taxable + tax;

  container.innerHTML = cart.map(item => `
    <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center gap-3">
      <img src="${item.image}" alt="${item.name}" class="w-10 h-10 rounded-lg object-cover shrink-0" />
      <div class="flex-1 min-w-0">
        <h5 class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${item.name}</h5>
        <span class="text-[11px] font-mono text-cyan-600 font-semibold">$${item.price.toFixed(2)} c/u</span>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" class="w-6 h-6 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 cursor-pointer" onclick="window.posUpdateQty('${item.id}', -1)">-</button>
        <span class="w-5 text-center text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">${item.qty}</span>
        <button type="button" class="w-6 h-6 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 cursor-pointer" onclick="window.posUpdateQty('${item.id}', 1)">+</button>
      </div>
      <span class="w-14 text-right text-xs font-bold font-mono text-slate-900 dark:text-white shrink-0">$${(item.price * item.qty).toFixed(2)}</span>
      <button type="button" class="text-slate-300 hover:text-rose-500 cursor-pointer shrink-0" onclick="window.posRemoveItem('${item.id}')" title="Eliminar"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (payBtn) {
    payBtn.textContent = `COBRAR $${total.toFixed(2)}`;
    payBtn.disabled = false;
  }

  if (window.lucide) window.lucide.createIcons();
}

function setupEventListeners() {
  // Category tabs
  const catButtons = document.querySelectorAll('.pos-cat-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-white', 'shadow-xs');
        b.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-cyan-500', 'text-white', 'shadow-xs');
      btn.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      activeCategory = btn.getAttribute('data-cat') || 'all';
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('pos-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }
}

// Global POS callbacks
window.posAddToCart = function(id) {
  const product = POS_PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
};

window.posUpdateQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  renderCart();
};

window.posRemoveItem = function(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
};

window.posClearCart = function() {
  if (confirm('¿Vaciar todo el ticket de comanda?')) {
    cart = [];
    renderCart();
  }
};

window.posToggleDiscount = function() {
  discountPercent = discountPercent === 0 ? 0.10 : 0;
  renderCart();
};

window.posOpenPaymentModal = function() {
  const modal = document.getElementById('pos-modal-payment');
  if (!modal) return;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal * discountPercent;
  const taxable = subtotal - discount;
  const total = taxable + (taxable * 0.18);

  const totalEl = document.getElementById('pos-modal-total');
  const cashInput = document.getElementById('pos-modal-cash');
  const changeEl = document.getElementById('pos-modal-change');

  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (cashInput) cashInput.value = total.toFixed(2);
  if (changeEl) changeEl.textContent = '$0.00';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.posClosePaymentModal = function() {
  const modal = document.getElementById('pos-modal-payment');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.posSetQuickCash = function(amount) {
  const cashInput = document.getElementById('pos-modal-cash');
  const totalEl = document.getElementById('pos-modal-total');
  const changeEl = document.getElementById('pos-modal-change');

  let total = parseFloat(totalEl.textContent.replace('$', '')) || 0;
  let cash = amount === 'exact' ? total : parseFloat(amount);

  if (cashInput) cashInput.value = cash.toFixed(2);
  let change = Math.max(0, cash - total);
  if (changeEl) changeEl.textContent = `$${change.toFixed(2)}`;
};

window.posConfirmSale = function() {
  alert('¡Venta completada con éxito! Ticket #TKT-1082 emitido.');
  cart = [];
  renderCart();
  window.posClosePaymentModal();
};

document.addEventListener('DOMContentLoaded', initPOS);

