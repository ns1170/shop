/**
 * WonderMarket - Buyer Page Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';

  // DOM要素
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const categoryPills = document.querySelectorAll('.category-pill');
  
  // カート関連要素
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartTriggerBtn = document.getElementById('cart-trigger-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTaxEl = document.getElementById('cart-tax');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // モーダル要素
  const productModal = document.getElementById('product-detail-modal');
  const productModalClose = document.getElementById('modal-close-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutModalClose = document.getElementById('checkout-close-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const orderSuccessModal = document.getElementById('order-success-modal');
  const successCloseBtn = document.getElementById('success-close-btn');

  // ========================================================
  // 初期ロードとデータ取得
  // ========================================================
  async function loadProducts() {
    allProducts = await window.storeManager.getProducts();
    renderProducts();
    updateCartUI();
  }

  // ========================================================
  // 商品フィルタ & 並び替え & レンダリング
  // ========================================================
  function renderProducts() {
    if (!productsGrid) return;

    let filtered = [...allProducts];

    // カテゴリフィルター
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    // 検索語句フィルター
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // ソート
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // featured
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // 空の場合
    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>該当する商品が見つかりませんでした</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">検索条件やカテゴリを変更してみてください。</p>
        </div>
      `;
      return;
    }

    // カード描画
    productsGrid.innerHTML = filtered.map(product => {
      const isOutOfStock = product.stock <= 0;
      const stockBadge = isOutOfStock
        ? `<span class="stock-tag" style="background-color: var(--danger);">品切れ</span>`
        : (product.stock <= 5 ? `<span class="stock-tag" style="background-color: var(--warning);">残り${product.stock}点</span>` : '');

      const badgeHtml = product.badge
        ? `<span class="badge badge-accent card-badge">${product.badge}</span>`
        : '';

      const ratingStars = '★'.repeat(Math.floor(product.rating || 5)) + (product.rating % 1 !== 0 ? '½' : '');

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-image-wrap" onclick="window.openProductModal('${product.id}')">
            ${badgeHtml}
            ${stockBadge}
            ${window.getProductSvg(product.image)}
          </div>
          <div class="card-body">
            <div class="card-category">${product.categoryName || 'GENERAL'}</div>
            <h3 class="card-title" onclick="window.openProductModal('${product.id}')">${escapeHtml(product.name)}</h3>
            <div class="card-rating">
              <span>${ratingStars}</span>
              <span style="font-weight:700; color:var(--text-main); font-size:0.85rem; margin-left:2px;">${product.rating || '5.0'}</span>
              <span class="card-rating-count">(${product.reviewCount || 0}件)</span>
            </div>
            <div class="card-price-row">
              <div class="card-price"><span>¥</span>${Number(product.price).toLocaleString()}</div>
              <span style="font-size:0.75rem; color:var(--text-light);">税込</span>
            </div>
            <div class="card-actions">
              <button 
                type="button"
                class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}" 
                onclick="window.handleAddToCart('${product.id}')"
                ${isOutOfStock ? 'disabled' : ''}
              >
                ${isOutOfStock ? '完売中' : '🛒 カートに追加'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // ========================================================
  // カートドロワー操作
  // ========================================================
  function openCart() {
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateCartUI() {
    const cart = window.storeManager.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // バッジ更新
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛍️</div>
          <p>カートには何も入っていません。</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="window.closeCartDrawer()">お買い物を続ける</button>
        </div>
      `;
      cartSubtotalEl.textContent = '¥0';
      cartTaxEl.textContent = '¥0';
      cartTotalEl.textContent = '¥0';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;

    // アイテムリスト生成
    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">
          ${window.getProductSvg(item.image)}
        </div>
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
            <div class="cart-item-price">${window.formatCurrency(item.price)}</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="window.changeCartQty('${item.id}', ${item.quantity - 1})">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.changeCartQty('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-remove-btn" onclick="window.removeCartItem('${item.id}')">削除</button>
          </div>
        </div>
      </div>
    `).join('');

    // 計算
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal; // 税込表示

    cartSubtotalEl.textContent = window.formatCurrency(subtotal - tax);
    cartTaxEl.textContent = window.formatCurrency(tax);
    cartTotalEl.textContent = window.formatCurrency(total);
  }

  // ========================================================
  // グローバル関数公開 (HTMLからonClickで呼ぶ)
  // ========================================================
  window.handleAddToCart = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    if (product.stock <= 0) {
      window.showToast('この商品は現在在庫切れです。', 'error');
      return;
    }

    window.storeManager.addToCart(product, 1);
    updateCartUI();
    window.showToast(`「${product.name}」をカートに追加しました！`);
  };

  window.changeCartQty = (productId, newQty) => {
    const product = allProducts.find(p => p.id === productId);
    if (product && newQty > product.stock) {
      window.showToast(`申し訳ありません。在庫は残り${product.stock}点です。`, 'error');
      return;
    }
    window.storeManager.updateCartQuantity(productId, newQty);
    updateCartUI();
  };

  window.removeCartItem = (productId) => {
    window.storeManager.updateCartQuantity(productId, 0);
    updateCartUI();
    window.showToast('商品をカートから削除しました', 'info');
  };

  window.closeCartDrawer = () => closeCart();

  // 商品詳細モーダル
  window.openProductModal = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product || !productModal) return;

    const modalBody = productModal.querySelector('.modal-body');
    const isOutOfStock = product.stock <= 0;

    modalBody.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 220px; background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.5rem; display: flex; align-items: center; justify-content: center;">
          <div style="width: 140px; height: 140px;">
            ${window.getProductSvg(product.image)}
          </div>
        </div>
        <div style="flex: 1.5; min-width: 240px; display: flex; flex-direction: column;">
          <span class="badge badge-primary" style="width: fit-content; margin-bottom: 0.5rem;">${product.categoryName || 'カテゴリ'}</span>
          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">${escapeHtml(product.name)}</h2>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem;">
            ${window.formatCurrency(product.price)} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 400;">(税込)</span>
          </div>
          <div style="margin-bottom: 1rem; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
            ${escapeHtml(product.description || '商品の説明はありません。')}
          </div>
          <div style="margin-bottom: 1.25rem; font-size: 0.85rem; background-color: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
            <div>📦 <strong>在庫状況:</strong> ${isOutOfStock ? '<span style="color:var(--danger)">在庫切れ</span>' : `残り ${product.stock} 点`}</div>
            <div style="margin-top: 0.25rem;">⭐ <strong>ユーザー評価:</strong> ${product.rating || 5.0} / 5.0 (${product.reviewCount || 0} レビュー)</div>
          </div>
          <div style="margin-top: auto;">
            <button 
              type="button"
              class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}" 
              style="width: 100%; padding: 0.8rem;"
              onclick="window.handleAddToCart('${product.id}'); window.closeProductModal();"
              ${isOutOfStock ? 'disabled' : ''}
            >
              ${isOutOfStock ? '完売中' : '🛒 今すぐカートに入れる'}
            </button>
          </div>
        </div>
      </div>
    `;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = () => {
    if (productModal) productModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // ========================================================
  // チェックアウト（購入手続き）
  // ========================================================
  checkoutBtn?.addEventListener('click', () => {
    const cart = window.storeManager.getCart();
    if (cart.length === 0) return;

    closeCart();
    // 注文サマリーの表示
    const summaryList = document.getElementById('checkout-items-summary');
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (summaryList) {
      summaryList.innerHTML = cart.map(i => `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding: 0.4rem 0; border-bottom: 1px dashed var(--border-color);">
          <span>${escapeHtml(i.name)} × ${i.quantity}</span>
          <strong>${window.formatCurrency(i.price * i.quantity)}</strong>
        </div>
      `).join('');
    }

    const checkoutTotalEl = document.getElementById('checkout-total-amount');
    if (checkoutTotalEl) {
      checkoutTotalEl.textContent = window.formatCurrency(totalAmount);
    }

    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  checkoutModalClose?.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // 注文送信
  checkoutForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cart = window.storeManager.getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '決済処理中...';
    }

    try {
      const order = await window.storeManager.createOrder(
        {},
        cart,
        total
      );

      checkoutModal.classList.remove('active');
      checkoutForm.reset();

      // 完了モーダル表示
      const orderIdEl = document.getElementById('success-order-id');
      const orderAmountEl = document.getElementById('success-order-total');
      if (orderIdEl) orderIdEl.textContent = order.id;
      if (orderAmountEl) orderAmountEl.textContent = window.formatCurrency(order.total);

      orderSuccessModal.classList.add('active');
      window.showToast('🎉 ご注文が完了しました！ありがとうございます。');

      // 商品データ再読み込み（在庫が減っているため）
      await loadProducts();
    } catch (err) {
      alert('注文処理中にエラーが発生しました');
      console.error(err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '注文を確定する';
      }
    }
  });

  successCloseBtn?.addEventListener('click', () => {
    orderSuccessModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // ========================================================
  // イベントリスナー登録
  // ========================================================
  cartTriggerBtn?.addEventListener('click', openCart);
  cartCloseBtn?.addEventListener('click', closeCart);
  cartBackdrop?.addEventListener('click', (e) => {
    if (e.target === cartBackdrop) closeCart();
  });

  productModalClose?.addEventListener('click', window.closeProductModal);
  productModal?.addEventListener('click', (e) => {
    if (e.target === productModal) window.closeProductModal();
  });

  // 検索
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // ソート
  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  // カテゴリタブ
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderProducts();
    });
  });

  // ストアイベント監視（販売者側で商品が変更された場合など）
  window.addEventListener('products-updated', async () => {
    allProducts = await window.storeManager.getProducts();
    renderProducts();
  });

  window.addEventListener('cart-updated', () => {
    updateCartUI();
  });

  // 初期化実行
  await loadProducts();
});

// HTMLエスケープ
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
