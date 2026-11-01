/**
 * WonderMarket - Seller (Dashboard) Page Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  let products = [];
  let orders = [];

  // DOM要素
  const tabBtns = document.querySelectorAll('.seller-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // KPI要素
  const kpiTotalSales = document.getElementById('kpi-total-sales');
  const kpiOrderCount = document.getElementById('kpi-order-count');
  const kpiProductCount = document.getElementById('kpi-product-count');
  const kpiLowStockCount = document.getElementById('kpi-low-stock-count');

  // 商品管理要素
  const productsTableBody = document.getElementById('seller-products-tbody');
  const addProductBtn = document.getElementById('btn-add-product');
  const productFormModal = document.getElementById('product-form-modal');
  const productFormClose = document.getElementById('modal-product-close');
  const productForm = document.getElementById('product-form');
  const formModalTitle = document.getElementById('form-modal-title');

  // 注文管理要素
  const ordersTableBody = document.getElementById('seller-orders-tbody');
  const orderFilterSelect = document.getElementById('order-filter-status');

  // 売上分析要素
  const chartBarsContainer = document.getElementById('sales-bar-chart');
  const categoryStatsContainer = document.getElementById('category-stats-list');

  // リセットボタン
  const resetDemoBtn = document.getElementById('btn-reset-demo');

  // ========================================================
  // 初期ロード
  // ========================================================
  async function loadDashboardData() {
    products = await window.storeManager.getProducts();
    orders = await window.storeManager.getOrders();

    updateKPIs();
    renderProductsTable();
    renderOrdersTable();
    renderAnalytics();
  }

  // ========================================================
  // KPIカード更新
  // ========================================================
  function updateKPIs() {
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalSales = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    if (kpiTotalSales) kpiTotalSales.textContent = window.formatCurrency(totalSales);
    if (kpiOrderCount) kpiOrderCount.textContent = orders.length + ' 件';
    if (kpiProductCount) kpiProductCount.textContent = products.length + ' 品';
    if (kpiLowStockCount) {
      kpiLowStockCount.textContent = lowStockCount + ' 品';
      kpiLowStockCount.style.color = lowStockCount > 0 ? 'var(--danger)' : 'var(--text-main)';
    }

    const prodBadge = document.getElementById('tab-badge-products');
    const ordBadge = document.getElementById('tab-badge-orders');
    if (prodBadge) prodBadge.textContent = products.length;
    if (ordBadge) ordBadge.textContent = orders.length;
  }

  // ========================================================
  // 商品管理テーブル描画
  // ========================================================
  function renderProductsTable() {
    if (!productsTableBody) return;

    if (products.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            出品されている商品がまだありません。「＋ 新規商品を出品」ボタンから登録してください。
          </td>
        </tr>
      `;
      return;
    }

    productsTableBody.innerHTML = products.map(prod => {
      const isLowStock = prod.stock <= 5;
      return `
        <tr data-id="${prod.id}">
          <td>
            <div class="table-product-cell">
              <div class="table-thumb">
                ${window.getProductSvg(prod.image)}
              </div>
              <div>
                <div class="product-cell-name">${escapeHtml(prod.name)}</div>
                <div class="product-cell-id">ID: ${prod.id}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-primary">${escapeHtml(prod.categoryName || prod.category)}</span>
          </td>
          <td style="font-weight: 700; color: var(--text-main);">
            ${window.formatCurrency(prod.price)}
          </td>
          <td>
            <div class="stock-stepper">
              <button class="stock-btn" onclick="window.sellerChangeStock('${prod.id}', -1)">-</button>
              <span class="stock-value ${isLowStock ? 'low' : ''}">${prod.stock}</span>
              <button class="stock-btn" onclick="window.sellerChangeStock('${prod.id}', 1)">+</button>
            </div>
          </td>
          <td>
            ${prod.badge ? `<span class="badge badge-accent">${escapeHtml(prod.badge)}</span>` : '<span style="color:var(--text-light);">-</span>'}
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.sellerEditProduct('${prod.id}')">編集</button>
              <button class="btn btn-danger btn-sm" onclick="window.sellerDeleteProduct('${prod.id}')">削除</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ========================================================
  // 注文管理テーブル描画
  // ========================================================
  function renderOrdersTable() {
    if (!ordersTableBody) return;

    let filteredOrders = [...orders];
    const filterStatus = orderFilterSelect ? orderFilterSelect.value : 'all';

    if (filterStatus !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.status === filterStatus);
    }

    if (filteredOrders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            条件に一致する注文はありません。
          </td>
        </tr>
      `;
      return;
    }

    ordersTableBody.innerHTML = filteredOrders.map(order => {
      const itemsSummary = (order.items || []).map(i => `${escapeHtml(i.name)} × ${i.quantity}`).join('<br>');
      const statusClass = `status-${order.status}`;

      return `
        <tr>
          <td>
            <strong>${order.id}</strong>
            <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 2px;">
              ${order.createdAt || '-'}
            </div>
          </td>
          <td>
            <div style="font-weight: 600;">${escapeHtml(order.customer?.name || 'ゲスト')}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(order.customer?.email || '')}</div>
            <div style="font-size: 0.75rem; color: var(--text-light);">${escapeHtml(order.customer?.address || '')}</div>
          </td>
          <td style="font-size: 0.85rem; line-height: 1.4;">
            ${itemsSummary}
          </td>
          <td style="font-weight: 800; color: var(--primary);">
            ${window.formatCurrency(order.total)}
          </td>
          <td>
            <select 
              class="status-select ${statusClass}" 
              onchange="window.sellerUpdateOrderStatus('${order.id}', this.value)"
            >
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ 注文受付</option>
              <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>📦 準備中</option>
              <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>🚚 発送済み</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ キャンセル</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ========================================================
  // 売上分析 & グラフ描画
  // ========================================================
  function renderAnalytics() {
    if (!chartBarsContainer || !categoryStatsContainer) return;

    const categoryTotals = {};
    let grandTotal = 0;

    orders.forEach(order => {
      if (order.status === 'cancelled') return;
      (order.items || []).forEach(item => {
        const prod = products.find(p => p.id === item.id);
        const catName = prod ? prod.categoryName : 'その他';
        const itemAmount = item.price * item.quantity;

        categoryTotals[catName] = (categoryTotals[catName] || 0) + itemAmount;
        grandTotal += itemAmount;
      });
    });

    const days = ['月', '火', '水', '木', '金', '土', '日'];
    const mockValues = [12000, 18500, 8900, 24000, 31000, 42000, 28000];
    const maxVal = Math.max(...mockValues, 1);

    chartBarsContainer.innerHTML = days.map((day, idx) => {
      const val = mockValues[idx];
      const pct = Math.round((val / maxVal) * 100);
      return `
        <div class="chart-col">
          <div class="chart-bar" style="height: ${pct}%;" data-tooltip="${window.formatCurrency(val)}"></div>
          <span class="chart-label">${day}</span>
        </div>
      `;
    }).join('');

    if (grandTotal === 0) {
      categoryStatsContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">注文データがまだありません。</p>';
      return;
    }

    const catEntries = Object.entries(categoryTotals);
    categoryStatsContainer.innerHTML = catEntries.map(([catName, amount]) => {
      const pct = Math.round((amount / grandTotal) * 100);
      return `
        <div class="category-row">
          <div class="cat-info">
            <span>${catName}</span>
            <span>${window.formatCurrency(amount)} (${pct}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ========================================================
  // グローバル関数公開 (HTMLから呼出)
  // ========================================================
  window.sellerChangeStock = async (prodId, delta) => {
    const p = products.find(x => x.id === prodId);
    if (!p) return;
    const newStock = Math.max(0, p.stock + delta);
    await window.storeManager.updateProductStock(prodId, newStock);
    await loadDashboardData();
    window.showToast(`在庫数を更新しました (${newStock}点)`);
  };

  window.sellerEditProduct = (prodId) => {
    const prod = products.find(x => x.id === prodId);
    if (!prod) return;

    formModalTitle.textContent = '商品を編集';
    document.getElementById('form-prod-id').value = prod.id;
    document.getElementById('form-prod-name').value = prod.name;
    document.getElementById('form-prod-price').value = prod.price;
    document.getElementById('form-prod-stock').value = prod.stock;
    document.getElementById('form-prod-category').value = prod.category;
    document.getElementById('form-prod-image').value = prod.image || 'cake';
    document.getElementById('form-prod-badge').value = prod.badge || '';
    document.getElementById('form-prod-desc').value = prod.description || '';

    productFormModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.sellerDeleteProduct = async (prodId) => {
    const prod = products.find(x => x.id === prodId);
    if (!prod) return;

    if (!confirm(`本当に「${prod.name}」を削除しますか？`)) {
      return;
    }

    await window.storeManager.deleteProduct(prodId);
    await loadDashboardData();
    window.showToast('商品を削除しました', 'info');
  };

  window.sellerUpdateOrderStatus = async (orderId, newStatus) => {
    await window.storeManager.updateOrderStatus(orderId, newStatus);
    await loadDashboardData();
    window.showToast(`注文 ${orderId} のステータスを更新しました`);
  };

  // ========================================================
  // モーダル操作・イベントリスナー
  // ========================================================
  addProductBtn?.addEventListener('click', () => {
    formModalTitle.textContent = '新規商品を出品';
    productForm.reset();
    document.getElementById('form-prod-id').value = '';
    productFormModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  productFormClose?.addEventListener('click', () => {
    productFormModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  productFormModal?.addEventListener('click', (e) => {
    if (e.target === productFormModal) {
      productFormModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  productForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('form-prod-id').value.trim();
    const name = document.getElementById('form-prod-name').value.trim();
    const price = parseInt(document.getElementById('form-prod-price').value, 10);
    const stock = parseInt(document.getElementById('form-prod-stock').value, 10);
    const category = document.getElementById('form-prod-category').value;
    const image = document.getElementById('form-prod-image').value;
    const badge = document.getElementById('form-prod-badge').value.trim();
    const description = document.getElementById('form-prod-desc').value.trim();

    const categoryNames = {
      cake: '生ケーキ・タルト',
      baked: '焼き菓子・クッキー',
      dessert: 'プリン・デザート',
      drink: 'カフェ・ドリンク'
    };

    const productData = {
      name,
      price,
      stock,
      category,
      categoryName: categoryNames[category] || 'その他',
      image,
      badge,
      description
    };

    if (id) {
      productData.id = id;
    }

    await window.storeManager.saveProduct(productData);
    productFormModal.classList.remove('active');
    document.body.style.overflow = '';
    await loadDashboardData();
    window.showToast(id ? '商品情報を更新しました！' : '🎉 新しい商品を出品しました！');
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(`tab-panel-${targetTab}`);
      if (panel) panel.classList.add('active');
    });
  });

  orderFilterSelect?.addEventListener('change', () => {
    renderOrdersTable();
  });

  resetDemoBtn?.addEventListener('click', () => {
    if (confirm('商品および注文データを初期状態に戻しますか？')) {
      window.storeManager.resetData();
    }
  });

  window.addEventListener('products-updated', async () => {
    await loadDashboardData();
  });
  window.addEventListener('orders-updated', async () => {
    await loadDashboardData();
  });

  await loadDashboardData();
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
