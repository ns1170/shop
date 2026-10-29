<?php
/**
 * WonderMarket - Seller Page (PHP版)
 */
$pageTitle = "WonderMarket | ストア管理ダッシュボード (販売者向け)";
$currentMode = "seller";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($pageTitle); ?></title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/seller.css">
</head>
<body>

  <!-- サイト共通ヘッダー -->
  <header class="site-header">
    <div class="header-container">
      <a href="seller.php" class="brand-logo">
        <div class="brand-icon" style="background: linear-gradient(135deg, #0284c7, #0f172a);">WM</div>
        <span>WonderMarket <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted); padding-left:4px;">Seller Center</span></span>
      </a>

      <!-- ユーザーロール切替 (購入者 / 販売者) -->
      <div class="mode-switcher" title="表示モードを切り替え">
        <a href="buyer.php" class="mode-btn">
          🛒 <span>購入者モード</span>
        </a>
        <a href="seller.php" class="mode-btn active seller">
          📊 <span>販売者モード</span>
        </a>
      </div>

      <div class="header-actions">
        <a href="buyer.php" class="btn btn-outline btn-sm">
          🏪 ショップを見る
        </a>
      </div>
    </div>
  </header>

  <main class="seller-container">
    <!-- 販売者バナー -->
    <section class="seller-header-banner">
      <div class="seller-banner-info">
        <h1>ストア管理コンソール</h1>
        <p>リアルタイムで出品商品の管理、注文の追跡、売上アナリティクスを確認できます。</p>
      </div>
      <div style="display:flex; gap:0.75rem; align-items:center;">
        <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-demo" title="初期データに戻す">
          🔄 デモ初期化
        </button>
        <button type="button" class="btn btn-primary" id="btn-add-product">
          ＋ 新規商品を出品
        </button>
      </div>
    </section>

    <!-- KPIサマリーカード -->
    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon revenue">💰</div>
        <div class="stat-details">
          <span class="stat-label">総売上高</span>
          <span class="stat-value" id="kpi-total-sales">¥0</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">📦</div>
        <div class="stat-details">
          <span class="stat-label">総注文件数</span>
          <span class="stat-value" id="kpi-order-count">0 件</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon products">🏷️</div>
        <div class="stat-details">
          <span class="stat-label">出品商品数</span>
          <span class="stat-value" id="kpi-product-count">0 品</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon alert">⚠️</div>
        <div class="stat-details">
          <span class="stat-label">在庫僅少 (5点以下)</span>
          <span class="stat-value" id="kpi-low-stock-count">0 品</span>
        </div>
      </div>
    </section>

    <!-- タブ切り替えバー -->
    <nav class="seller-tabs-nav">
      <button type="button" class="seller-tab-btn active" data-tab="products">
        🏷️ 商品管理 <span class="tab-badge" id="tab-badge-products">0</span>
      </button>
      <button type="button" class="seller-tab-btn" data-tab="orders">
        📑 注文・発送管理 <span class="tab-badge" id="tab-badge-orders">0</span>
      </button>
      <button type="button" class="seller-tab-btn" data-tab="analytics">
        📈 売上・統計分析
      </button>
    </nav>

    <!-- タブ1: 商品管理 -->
    <section class="tab-panel active" id="tab-panel-products">
      <div class="panel-header">
        <h2 class="panel-title">出品中商品一覧</h2>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>商品名 / ID</th>
                <th>カテゴリ</th>
                <th>価格 (税込)</th>
                <th>在庫数 (クリックで増減)</th>
                <th>バッジ</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="seller-products-tbody">
              <!-- 動的生成 -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- タブ2: 注文管理 -->
    <section class="tab-panel" id="tab-panel-orders">
      <div class="panel-header">
        <h2 class="panel-title">受信した注文一覧</h2>
        <div>
          <select id="order-filter-status" class="sort-select" style="padding:0.45rem 1rem;">
            <option value="all">すべてのステータス</option>
            <option value="pending">⏳ 注文受付</option>
            <option value="processing">📦 準備中</option>
            <option value="shipped">🚚 発送済み</option>
            <option value="cancelled">❌ キャンセル</option>
          </select>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>注文ID / 日時</th>
                <th>お客様情報</th>
                <th>注文商品・数量</th>
                <th>合計金額</th>
                <th>ステータス変更</th>
              </tr>
            </thead>
            <tbody id="seller-orders-tbody">
              <!-- 動的生成 -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- タブ3: 売上分析 -->
    <section class="tab-panel" id="tab-panel-analytics">
      <div class="panel-header">
        <h2 class="panel-title">売上パフォーマンス</h2>
      </div>

      <div class="analytics-grid">
        <div class="chart-card">
          <h3>週間売上推移 (直近7日間)</h3>
          <div class="bar-chart" id="sales-bar-chart">
            <!-- 動的生成 -->
          </div>
        </div>

        <div class="chart-card">
          <h3>カテゴリ別売上比率</h3>
          <div class="category-pie-list" id="category-stats-list">
            <!-- 動的生成 -->
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- 商品登録・編集モーダル -->
  <div class="modal-overlay" id="product-form-modal">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title" id="form-modal-title">新規商品を出品</span>
        <button class="modal-close-btn" id="modal-product-close">&times;</button>
      </div>
      <form id="product-form">
        <input type="hidden" id="form-prod-id">
        <div class="modal-body">
          <div class="checkout-form">
            <div class="form-group">
              <label class="form-label" for="form-prod-name">商品名 <span style="color:var(--danger)">*</span></label>
              <input type="text" id="form-prod-name" class="form-input" placeholder="例: スマート プリズムライト" required>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="form-prod-price">販売価格 (¥・税込) <span style="color:var(--danger)">*</span></label>
                <input type="number" id="form-prod-price" class="form-input" min="100" max="1000000" placeholder="5800" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="form-prod-stock">初期在庫数 <span style="color:var(--danger)">*</span></label>
                <input type="number" id="form-prod-stock" class="form-input" min="0" max="9999" placeholder="10" required>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="form-prod-category">カテゴリ</label>
                <select id="form-prod-category" class="form-input">
                  <option value="interior">インテリア・照明</option>
                  <option value="gadget">デジタル・ガジェット</option>
                  <option value="daily">日用品・キッチン</option>
                  <option value="fashion">ファッション・雑貨</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="form-prod-image">デザインアイコン</label>
                <select id="form-prod-image" class="form-input">
                  <option value="lamp">💡 レトロランプ</option>
                  <option value="plant">🌱 浮遊プラント</option>
                  <option value="sound">📻 サウンドマシン</option>
                  <option value="tumbler">🥤 チタンタンブラー</option>
                  <option value="keyboard">⌨️ 蓄光キーボード</option>
                  <option value="diffuser">🌸 アロマディフューザー</option>
                  <option value="wallet">👛 本革ウォレット</option>
                  <option value="poster">🖼️ ホログラムポスター</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="form-prod-badge">アピールバッジ (任意)</label>
              <input type="text" id="form-prod-badge" class="form-input" placeholder="例: NEW, 人気, セール">
            </div>

            <div class="form-group">
              <label class="form-label" for="form-prod-desc">商品説明文</label>
              <textarea id="form-prod-desc" class="form-input" rows="3" placeholder="商品の特徴、素材、おすすめポイントなどを記載してください。"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary" style="width: 100%;">保存して出品する</button>
        </div>
      </form>
    </div>
  </div>

  <!-- フッター -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="brand-logo">
          <div class="brand-icon" style="background: linear-gradient(135deg, #0284c7, #0f172a);">WM</div>
          <span>WonderMarket Seller</span>
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
  <script src="js/seller.js"></script>
</body>
</html>