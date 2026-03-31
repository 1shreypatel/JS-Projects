function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', warning: '⚠️', error: '❌' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.length;
}

// ✅ FIX: addToCart pe click karne pe cart.html nahi jayega
window.addToCart = function (id) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);
  if (!product) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const exists = cart.find(item => item.id === id);

  if (exists) {
    showToast('Already in cart! 🛒', 'warning');
  } else {
    cart.push({ ...product, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`"${product.name}" added to cart! 🎉`, 'success');

    // Button ka look update karo — in-cart state
    const btn = document.querySelector(`[data-cart-id="${id}"]`);
    if (btn) {
      btn.textContent = '✓ Added';
      btn.classList.add('btn-in-cart');
      btn.disabled = true;
    }
  }
};

window.viewProduct = function (id) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);
  if (product) {
    localStorage.setItem('viewProduct', JSON.stringify(product));
    window.location.href = 'view.html';
  }
};

window.deleteProduct = function (id) {
  if (!confirm('Delete this product?')) return;
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(products));
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.reload();
};

const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const img = document.getElementById('img').value.trim();

    if (!name || !price || !img) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const product = { id: Date.now(), name, price, img };
    const data = JSON.parse(localStorage.getItem('products')) || [];
    data.push(product);
    localStorage.setItem('products', JSON.stringify(data));

    showToast('Product added!', 'success');
    setTimeout(() => window.location.href = 'parodect.html', 800);
  });
}

const container = document.getElementById('container');
const searchInput = document.getElementById('search');

if (container && searchInput) {
  let products = JSON.parse(localStorage.getItem('products')) || [];

  function renderProducts(data) {
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="width:100%">
          <div class="icon">📦</div>
          <h3>No products found</h3>
          <p>Try a different search or add new products.</p>
        </div>`;
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    data.forEach(p => {
      const inCart = cart.some(item => item.id === p.id);
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img class="card-img" src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/400x300/1a1a1a/888?text=No+Image'">
        <div class="card-body">
          <div class="card-name" title="${p.name}">${p.name}</div>
          <div class="card-price">₹${Number(p.price).toLocaleString('en-IN')}</div>
          <div class="card-actions">
            <button class="btn-primary" onclick="viewProduct(${p.id})">View</button>
            <button
              class="btn-outline ${inCart ? 'btn-in-cart' : ''}"
              data-cart-id="${p.id}"
              onclick="addToCart(${p.id})"
              ${inCart ? 'disabled' : ''}
            >${inCart ? '✓ Added' : '+ Cart'}</button>
          </div>
        </div>`;
      container.appendChild(div);
    });
  }

  renderProducts(products);
  updateCartCount();

  searchInput.addEventListener('input', function () {
    const val = this.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(val));
    renderProducts(filtered);
  });
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty = Math.max(1, (item.qty || 1) + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  let cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
  showToast('Item removed', 'warning');
  renderCart();
}

function clearCart() {
  if (!confirm('Clear all items from cart?')) return;
  localStorage.removeItem('cart');
  updateCartCount();
  showToast('Cart cleared', 'warning');
  renderCart();
}

function checkout() {
  localStorage.removeItem('cart');
  updateCartCount();
  showToast('Order placed successfully! 🎉', 'success');
  setTimeout(() => window.location.href = 'parodect.html', 1500);
}

function renderCart() {
  const cart = getCart();
  const body = document.getElementById('cartBody');
  const subtitle = document.getElementById('cartSubtitle');
  if (!body || !subtitle) return;

  const totalItems = cart.reduce((s, p) => s + (p.qty || 1), 0);
  subtitle.textContent = cart.length
    ? `${cart.length} product${cart.length > 1 ? 's' : ''}, ${totalItems} item${totalItems > 1 ? 's' : ''}`
    : '';

  if (cart.length === 0) {
    body.innerHTML = `
        <div class="cart-empty">
          <div class="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Go back and add some products!</p><br>
          <a class="cart-btn" href="parodect.html">Add Products</a>
        </div>`;
    return;
  }

  const subtotal = cart.reduce((s, p) => s + Number(p.price) * (p.qty || 1), 0);
  const shipping = subtotal > 999 ? 0 : 49;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + gst;

  body.innerHTML = `
      <div class="cart-layout">
        <div id="cartItems"></div>
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''})</span>
            <span>₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row">
            <span>GST (18%)</span>
            <span>₹${gst.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>₹${grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <br>
          <button class="btn-full" onclick="checkout()">Place Order →</button>
          <button class="btn-full" onclick="clearCart()"
            style="background:transparent;border:1px solid var(--border);color:var(--text-muted);margin-top:10px;">
            🗑 Clear Cart
          </button>
        </div>
      </div>`;

  const wrap = document.getElementById('cartItems');
  cart.forEach(p => {
    const qty = p.qty || 1;
    const itemTotal = Number(p.price) * qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <img src="${p.img}" alt="${p.name}"
             onerror="this.src='https://placehold.co/200x200/1a1a1a/888?text=?'">
        <div class="cart-item-info">
          <h4>${p.name}</h4>
          <div class="item-price">₹${Number(p.price).toLocaleString('en-IN')} / piece</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
            <div class="qty-value">${qty}</div>
            <button class="qty-btn" onclick="changeQty(${p.id}, +1)">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <button class="delete-btn" onclick="removeItem(${p.id})" title="Remove">🗑</button>
          <div class="item-total">₹${itemTotal.toLocaleString('en-IN')}</div>
        </div>`;
    wrap.appendChild(div);
  });
}

renderCart();

const product = JSON.parse(localStorage.getItem('viewProduct'));
const detail = document.getElementById('detail');

updateCartCount();

if (detail && product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const inCart = cart.some(item => item.id === product.id);

  detail.innerHTML = `
      <div class="detail-wrap">
        <img class="detail-img"
             src="${product.img}"
             alt="${product.name}"
             onerror="this.src='https://placehold.co/600x500/1a1a1a/888?text=No+Image'">
        <div class="detail-info">
          <h1>${product.name}</h1>
          <div class="detail-price">₹${Number(product.price).toLocaleString('en-IN')}</div>
          <hr class="detail-divider">
          <p style="color:var(--text-muted);font-size:14px;line-height:1.7;margin-bottom:24px;">
            Premium quality product. Add to cart and checkout securely.
            All products come with a satisfaction guarantee.
          </p>
          <div class="detail-actions">
            <button class="btn-primary" id="detailCartBtn" onclick="handleAddToCart()">
              ${inCart ? '✓ Already in Cart' : '🛒 Add to Cart'}
            </button>
            <button class="btn-outline" onclick="handleBuyNow()">💳 Buy Now</button>
          </div>
          ${inCart ? '<p style="color:var(--green);font-size:13px;margin-top:12px;">✅ This item is in your cart. <a href="cart.html" style="color:var(--gold);">Go to Cart →</a></p>' : ''}
        </div>
      </div>`;
} else if (detail) {
  detail.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h3>Product not found</h3>
        <p>Go back and select a product.</p>
        <br>
        <a class="back-btn" href="parodect.html">← Back to Products</a>
      </div>`;
}

function handleAddToCart() {
  if (!product) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const exists = cart.find(item => item.id === product.id);
  if (exists) {
    showToast('Already in cart! Go to cart to checkout. 🛒', 'warning');
  } else {
    cart.push({ ...product, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Added to cart! 🎉', 'success');
    updateCartCount();

    // Button update
    const btn = document.getElementById('detailCartBtn');
    if (btn) {
      btn.textContent = '✓ Already in Cart';
      btn.disabled = true;
      btn.classList.add('btn-in-cart');
    }
  }
}

function handleBuyNow() {
  if (!product) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const exists = cart.find(item => item.id === product.id);
  if (!exists) {
    cart.push({ ...product, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
  window.location.href = 'cart.html';
}