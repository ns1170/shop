<?php
/**
 * WonderMarket - Buyer Page (PHP版)
 */
$pageTitle = "WonderMarket | 厳選パティスリー＆極上スイーツ";
$currentMode = "buyer";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($pageTitle); ?></title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/buyer.css">
</head>
<body>

  <!-- サイト共通ヘッダー -->
  <header class="site-header">
    <div class="header-container">
      <a href="buyer.php" class="brand-logo">
        <div class="brand-icon">WM</div>
        <span>WonderMarket</span>
      </a>

      <!-- ユーザーロール切替 (購入者 / 販売者) -->
      <div class="mode-switcher" title="表示モードを切り替え">
        <a href="buyer.php" class="mode-btn active">
          🛒 <span>購入者モード</span>
        </a>
        <a href="seller.php" class="mode-btn">
          📊 <span>販売者モード</span>
        </a>
      </div>

      <!-- カートボタン -->
      <div class="header-actions">
        <button class="cart-btn-trigger" id="cart-trigger-btn" aria-label="ショッピングカートを開く">
          <span>🛒 カート</span>
          <span class="cart-count-badge" style="display: none;">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- ヒーローセクション -->
  <section class="hero-section">
    <div class="hero-content">
      <span class="hero-tag">✨ SPECIAL SWEETS COLLECTION</span>
      <h1 class="hero-title">特別なひとときを彩る、<br>職人仕込みの手作りスイーツ。</h1>
      <p class="hero-desc">厳選素材で作る極上ショートケーキ、濃厚ガトーショコラ、焼きたてカヌレや香ばしい珈琲まで。心ほどける甘い幸せをお届けします。</p>
    </div>
  </section>

  <!-- メインカタログエリア -->
  <main class="catalog-container">
    <div class="catalog-controls">
      <div class="controls-top">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" class="search-input" placeholder="商品名やキーワードで探す...">
        </div>
        <div class="sort-box">
          <select id="sort-select" class="sort-select">
            <option value="featured">おすすめ順</option>
            <option value="price-asc">価格が安い順</option>
            <option value="price-desc">価格が高い順</option>
            <option value="rating">評価が高い順</option>
          </select>
        </div>
      </div>

      <div class="category-filter">
        <button type="button" class="category-pill active" data-category="all">すべて</button>
        <button type="button" class="category-pill" data-category="cake">生ケーキ・タルト</button>
        <button type="button" class="category-pill" data-category="baked">焼き菓子・クッキー</button>
        <button type="button" class="category-pill" data-category="dessert">プリン・デザート</button>
        <button type="button" class="category-pill" data-category="drink">カフェ・ドリンク</button>
      </div>
    </div>

    <!-- 商品一覧グリッド -->
    <div class="products-grid" id="products-grid">
      <!-- JavaScriptで動的生成 -->
    </div>
  </main>

  <!-- カートドロワー -->
  <div class="cart-drawer-backdrop" id="cart-backdrop">
    <aside class="cart-drawer" id="cart-drawer">
      <div class="cart-header">
        <div class="cart-header-title">
          <span>🛒</span>
          <span>現在のカート (<span class="cart-count-badge">0</span>)</span>
        </div>
        <button class="modal-close-btn" id="cart-close-btn">&times;</button>
      </div>

      <div class="cart-body" id="cart-items-list">
        <!-- 動的生成 -->
      </div>

      <div class="cart-footer">
        <div class="cart-summary-row">
          <span>小計 (税抜)</span>
          <span id="cart-subtotal">¥0</span>
        </div>
        <div class="cart-summary-row">
          <span>消費税 (10%)</span>
          <span id="cart-tax">¥0</span>
        </div>
        <div class="cart-summary-total">
          <span>合計金額 (税込)</span>
          <span id="cart-total" style="color: var(--primary);">¥0</span>
        </div>
        <button type="button" class="btn btn-primary" id="checkout-btn" style="width: 100%; padding: 0.85rem;" disabled>
          注文手続きへ進む 👉
        </button>
      </div>
    </aside>
  </div>

  <!-- 商品詳細モーダル -->
  <div class="modal-overlay" id="product-detail-modal">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">商品詳細</span>
        <button class="modal-close-btn" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body"></div>
    </div>
  </div>

  <!-- チェックアウト モーダル -->
  <div class="modal-overlay" id="checkout-modal">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">📦 ご注文内容の確認と配送先入力</span>
        <button class="modal-close-btn" id="checkout-close-btn">&times;</button>
      </div>
      <form id="checkout-form">
        <div class="modal-body">
          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="margin-bottom: 0.5rem; display: block;">注文サマリー</label>
            <div id="checkout-items-summary" style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-md);"></div>
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; margin-top: 0.75rem; padding: 0 0.5rem;">
              <span>お支払い合計:</span>
              <span id="checkout-total-amount" style="color: var(--primary);">¥0</span>
            </div>
          </div>

          <div class="checkout-form">
            <div class="form-group">
              <label class="form-label" for="cust-name">お名前 <span style="color:var(--danger)">*</span></label>
              <input type="text" id="cust-name" class="form-input" placeholder="例: 山田 太郎" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="cust-email">メールアドレス <span style="color:var(--danger)">*</span></label>
              <input type="email" id="cust-email" class="form-input" placeholder="例: yamada@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="cust-address">配送先住所 <span style="color:var(--danger)">*</span></label>
              <input type="text" id="cust-address" class="form-input" placeholder="例: 東京都港区六本木6-10-1" required>
            </div>
            <div class="form-group">
              <label class="form-label">お支払い方法</label>
              <div style="background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted);">
                💳 デモ決済 (シミュレーションのためクレジットカード番号等の入力は不要です)
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary" style="width: 100%;">注文を確定する</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 注文完了モーダル -->
  <div class="modal-overlay" id="order-success-modal">
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-body">
        <div class="order-success-card">
          <div class="order-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">ご注文ありがとうございます！</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
            注文番号: <strong id="success-order-id" style="color: var(--primary);"></strong><br>
            決済金額: <strong id="success-order-total"></strong>
          </p>
          <div style="background-color: var(--bg-subtle); border-radius: var(--radius-md); padding: 1rem; font-size: 0.85rem; color: var(--text-muted); text-align: left; margin-bottom: 1.5rem;">
            💡 <strong>販売者モードで確認できます:</strong><br>
            上部の「販売者モード」に切り替えると、今行った注文がリアルタイムに受注一覧に反映され、配送ステータスの更新が試せます。
          </div>
          <button type="button" class="btn btn-primary" id="success-close-btn" style="width: 100%;">お買い物を続ける</button>
        </div>
      </div>
    </div>
  </div>

  <!-- フッター -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="brand-logo">
          <div class="brand-icon">WM</div>
          <span>WonderMarket</span>
        </div>
        <div class="footer-links">
          <a href="buyer.php">購入者トップ</a>
          <a href="seller.php">販売者ダッシュボード</a>
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 WonderMarket Store. Built with HTML, CSS, JavaScript & PHP.</p>
      </div>
    </div>
  </footer>

  <script src="js/store.js"></script>
  <script src="js/buyer.js"></script>
</body>
</html>