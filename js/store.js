/**
 * WonderMarket - Store Management & Data Layer
 * Python REST API, PHP API, および LocalStorage のトリプルハイブリッド自動同期ストア
 */

// デフォルト初期商品データ
const INITIAL_PRODUCTS = [
  {
    id: "prod_001",
    name: "極上 苺のプレミアムショートケーキ",
    category: "cake",
    categoryName: "生ケーキ・タルト",
    price: 750,
    stock: 15,
    description: "国産の朝摘み苺と北海道産フレッシュ純生クリームを贅沢に使用。口どけのよいふわふわスポンジが絶品の大人気王道ショートケーキです。",
    featured: true,
    rating: 4.9,
    reviewCount: 48,
    badge: "人気No.1",
    image: "cake"
  },
  {
    id: "prod_002",
    name: "濃厚クラシック ベルギー生ガトーショコラ",
    category: "cake",
    categoryName: "生ケーキ・タルト",
    price: 720,
    stock: 12,
    description: "カカオ分72%の上質なベルギー産クーベルチュールチョコレートを贅沢に使用。低温でじっくり焼き上げた濃厚でとろける舌触り。",
    featured: true,
    rating: 4.9,
    reviewCount: 36,
    badge: "定番",
    image: "chocolate"
  },
  {
    id: "prod_003",
    name: "焦がしキャラメル バスクチーズケーキ",
    category: "cake",
    categoryName: "生ケーキ・タルト",
    price: 780,
    stock: 14,
    description: "高温短時間で香ばしく焼き上げたビターな表面と、中心部のとろりとなめらかで濃厚なクリームチーズのハーモニーが絶妙です。",
    featured: true,
    rating: 5.0,
    reviewCount: 52,
    badge: "注目",
    image: "cheesecake"
  },
  {
    id: "prod_004",
    name: "彩り旬果実の贅沢タルト",
    category: "cake",
    categoryName: "生ケーキ・タルト",
    price: 850,
    stock: 10,
    description: "発酵バター香るサクサクの自家製パート・サブレに、バニラビーンズ香る特製カスタードと色鮮やかな旬のフルーツをたっぷり敷き詰めました。",
    featured: false,
    rating: 4.8,
    reviewCount: 29,
    badge: "おすすめ",
    image: "tart"
  },
  {
    id: "prod_005",
    name: "熟成ボルドー風 蜜蝋カヌレ (4個入)",
    category: "baked",
    categoryName: "焼き菓子・クッキー",
    price: 1300,
    stock: 20,
    description: "外側は蜜蝋でカリッと芳ばしく、内側はラム酒とマダガスカル産バニラが豊かに香るもっちりしっとり食感。毎朝店内で丁寧に焼き上げています。",
    featured: false,
    rating: 4.7,
    reviewCount: 33,
    badge: "焼きたて",
    image: "canele"
  },
  {
    id: "prod_006",
    name: "特製手焼き 発酵バターフィナンシェ＆クッキー缶",
    category: "baked",
    categoryName: "焼き菓子・クッキー",
    price: 2400,
    stock: 16,
    description: "フランス産AOP発酵バターと香ばしいシチリア産アーモンドプードルをふんだんに使用。芳醇な香りと上品な甘みの詰め合わせギフト。",
    featured: true,
    rating: 4.9,
    reviewCount: 41,
    badge: "ギフト",
    image: "cookie"
  },
  {
    id: "prod_007",
    name: "昔ながらのクラシック カスタードプリン",
    category: "dessert",
    categoryName: "プリン・デザート",
    price: 500,
    stock: 25,
    description: "新鮮な契約農家の卵と北海道十勝産牛乳を贅沢に使い、低温スチームで丁寧に蒸し上げた程よい固さの王道プリン。ほろ苦い手作りカラメルソース付き。",
    featured: false,
    rating: 4.8,
    reviewCount: 65,
    badge: "好評",
    image: "pudding"
  },
  {
    id: "prod_008",
    name: "自家焙煎 スペシャルティブレンド珈琲豆 (200g)",
    category: "drink",
    categoryName: "カフェ・ドリンク",
    price: 1600,
    stock: 30,
    description: "スイーツの美味しさを引き立てる当店特製の中深煎りブレンド。ダークチョコレートのような甘みと芳醇なアロマが心地よく広がります。",
    featured: false,
    rating: 4.8,
    reviewCount: 22,
    badge: "自家焙煎",
    image: "coffee"
  }
];

// 初期注文データ
const INITIAL_ORDERS = [
  {
    id: "ord_1001",
    items: [
      { id: "prod_001", name: "極上 苺のプレミアムショートケーキ", price: 750, image: "cake", category: "cake", quantity: 2 },
      { id: "prod_008", name: "自家焙煎 スペシャルティブレンド珈琲豆 (200g)", price: 1600, image: "coffee", category: "drink", quantity: 1 }
    ],
    total: 3100,
    status: "shipped",
    createdAt: "2026-10-29 14:22:10"
  },
  {
    id: "ord_1002",
    items: [
      { id: "prod_003", name: "焦がしキャラメル バスクチーズケーキ", price: 780, image: "cheesecake", category: "cake", quantity: 1 },
      { id: "prod_006", name: "特製手焼き 発酵バターフィナンシェ＆クッキー缶", price: 2400, image: "cookie", category: "baked", quantity: 1 }
    ],
    total: 3180,
    status: "processing",
    createdAt: "2026-10-30 09:15:40"
  },
  {
    id: "ord_1003",
    items: [
      { id: "prod_002", name: "濃厚クラシック ベルギー生ガトーショコラ", price: 720, image: "chocolate", category: "cake", quantity: 2 },
      { id: "prod_007", name: "昔ながらのクラシック カスタードプリン", price: 500, image: "pudding", category: "dessert", quantity: 2 }
    ],
    total: 2440,
    status: "pending",
    createdAt: "2026-10-31 11:45:00"
  }
];

class StoreManager {
  constructor() {
    this.storageKeyProducts = 'wondermarket_products_v3';
    this.storageKeyOrders = 'wondermarket_orders_v3';
    this.storageKeyCart = 'wondermarket_cart_v3';
    this.backendMode = 'local'; // 'python' | 'php' | 'local'
    this.isInitialized = false;
  }

  // 初期化: Python REST API -> PHP API -> LocalStorage の順にフォールバック
  async init() {
    if (this.isInitialized) return;

    try {
      // 1. Python REST API の確認
      const pyRes = await fetch('/api/products', { method: 'GET' });
      if (pyRes.ok) {
        const json = await pyRes.json();
        if (json && json.success) {
          this.backendMode = 'python';
          console.log('[Store] Connected to Python REST API Server (Port 80).');
        }
      }
    } catch (e) {
      // 2. PHP API の確認
      try {
        const phpRes = await fetch('api.php?action=products', { method: 'GET' });
        if (phpRes.ok) {
          const json = await phpRes.json();
          if (json && json.success) {
            this.backendMode = 'php';
            console.log('[Store] Connected to PHP Backend API.');
          }
        }
      } catch (e2) {
        this.backendMode = 'local';
        console.log('[Store] Running in GitHub Pages / Standalone Mode (LocalStorage).');
      }
    }

    // LocalStorage初期化
    if (!localStorage.getItem(this.storageKeyProducts)) {
      localStorage.setItem(this.storageKeyProducts, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(this.storageKeyOrders)) {
      localStorage.setItem(this.storageKeyOrders, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(this.storageKeyCart)) {
      localStorage.setItem(this.storageKeyCart, JSON.stringify([]));
    }

    this.isInitialized = true;
  }

  // ==========================================
  // 商品関連 API
  // ==========================================
  async getProducts() {
    await this.init();

    if (this.backendMode === 'python') {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(this.storageKeyProducts, JSON.stringify(json.data));
          return json.data;
        }
      } catch (err) {
        console.warn('Python API getProducts failed, fallback', err);
      }
    } else if (this.backendMode === 'php') {
      try {
        const res = await fetch('api.php?action=products');
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(this.storageKeyProducts, JSON.stringify(json.data));
          return json.data;
        }
      } catch (err) {
        console.warn('PHP API getProducts failed, fallback', err);
      }
    }

    const data = localStorage.getItem(this.storageKeyProducts);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  }

  async saveProduct(product) {
    await this.init();

    if (this.backendMode === 'python') {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        const json = await res.json();
        if (json.success) {
          window.dispatchEvent(new CustomEvent('products-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('Python API saveProduct failed, fallback', err);
      }
    } else if (this.backendMode === 'php') {
      try {
        const res = await fetch('api.php?action=products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        const json = await res.json();
        if (json.success) {
          window.dispatchEvent(new CustomEvent('products-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('PHP API saveProduct failed, fallback', err);
      }
    }

    // LocalStorageフォールバック
    let products = await this.getProducts();
    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...product };
      } else {
        products.push(product);
      }
    } else {
      const newProduct = {
        ...product,
        id: 'prod_' + Date.now(),
        rating: 5.0,
        reviewCount: 0,
        badge: product.badge || 'NEW'
      };
      products.push(newProduct);
    }

    localStorage.setItem(this.storageKeyProducts, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('products-updated'));
    return products;
  }

  async deleteProduct(id) {
    await this.init();

    if (this.backendMode === 'python') {
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          window.dispatchEvent(new CustomEvent('products-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('Python API delete failed', err);
      }
    } else if (this.backendMode === 'php') {
      try {
        const res = await fetch(`api.php?action=products&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          window.dispatchEvent(new CustomEvent('products-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('PHP API delete failed', err);
      }
    }

    let products = await this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.storageKeyProducts, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('products-updated'));
    return products;
  }

  async updateProductStock(id, newStock) {
    const products = await this.getProducts();
    const target = products.find(p => p.id === id);
    if (target) {
      target.stock = Math.max(0, parseInt(newStock, 10) || 0);
      return await this.saveProduct(target);
    }
  }

  // ==========================================
  // カート関連 (クライアント側)
  // ==========================================
  getCart() {
    const data = localStorage.getItem(this.storageKeyCart);
    return data ? JSON.parse(data) : [];
  }

  saveCart(cart) {
    localStorage.setItem(this.storageKeyCart, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
  }

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    this.saveCart(cart);
  }

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.quantity = quantity;
    }
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  // ==========================================
  // 注文関連 API
  // ==========================================
  async getOrders() {
    await this.init();

    if (this.backendMode === 'python') {
      try {
        const res = await fetch('/api/orders');
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(this.storageKeyOrders, JSON.stringify(json.data));
          return json.data;
        }
      } catch (err) {
        console.warn('Python API getOrders failed', err);
      }
    } else if (this.backendMode === 'php') {
      try {
        const res = await fetch('api.php?action=orders');
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(this.storageKeyOrders, JSON.stringify(json.data));
          return json.data;
        }
      } catch (err) {
        console.warn('PHP API getOrders failed', err);
      }
    }

    const data = localStorage.getItem(this.storageKeyOrders);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  }

  async createOrder(customer, items, total) {
    await this.init();

    const orderPayload = { customer, items, total };

    if (this.backendMode === 'python') {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const json = await res.json();
        if (json.success) {
          this.clearCart();
          window.dispatchEvent(new CustomEvent('orders-updated'));
          window.dispatchEvent(new CustomEvent('products-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('Python API createOrder failed', err);
      }
    } else if (this.backendMode === 'php') {
      try {
        const res = await fetch('api.php?action=orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const json = await res.json();
        if (json.success) {
          this.clearCart();
          window.dispatchEvent(new CustomEvent('orders-updated'));
          window.dispatchEvent(new CustomEvent('products-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('PHP API createOrder failed', err);
      }
    }

    // LocalStorageフォールバック
    const orders = await this.getOrders();
    const products = await this.getProducts();

    for (const item of items) {
      const p = products.find(x => x.id === item.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    }
    localStorage.setItem(this.storageKeyProducts, JSON.stringify(products));

    const newOrder = {
      id: 'ord_' + (orders.length + 1001),
      customer,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    orders.unshift(newOrder);
    localStorage.setItem(this.storageKeyOrders, JSON.stringify(orders));
    this.clearCart();

    window.dispatchEvent(new CustomEvent('orders-updated'));
    window.dispatchEvent(new CustomEvent('products-updated'));
    return newOrder;
  }

  async updateOrderStatus(orderId, status) {
    await this.init();

    if (this.backendMode === 'python') {
      try {
        const res = await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: orderId, status })
        });
        const json = await res.json();
        if (json.success) {
          window.dispatchEvent(new CustomEvent('orders-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('Python API updateOrderStatus failed', err);
      }
    } else if (this.backendMode === 'php') {
      try {
        const res = await fetch('api.php?action=update_order_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: orderId, status })
        });
        const json = await res.json();
        if (json.success) {
          window.dispatchEvent(new CustomEvent('orders-updated'));
          return json.data;
        }
      } catch (err) {
        console.warn('PHP API updateOrderStatus failed', err);
      }
    }

    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(this.storageKeyOrders, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('orders-updated'));
    }
    return orders;
  }

  async resetData() {
    if (this.backendMode === 'python') {
      try {
        await fetch('/api/reset', { method: 'POST' });
      } catch (e) {}
    }
    localStorage.setItem(this.storageKeyProducts, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(this.storageKeyOrders, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(this.storageKeyCart, JSON.stringify([]));
    window.location.reload();
  }
}

window.storeManager = new StoreManager();

// ==========================================
// SVGベクターグラフィック生成
// ==========================================
window.getProductSvg = function(imageKey) {
  const svgs = {
    cake: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FFF1F2" opacity="0.8"/>
        <!-- ケーキベース・スポンジ層 -->
        <path d="M18 68 L50 78 L82 62 L82 46 L50 62 L18 52 Z" fill="#FDE047" stroke="#EAB308" stroke-width="1.5"/>
        <path d="M18 60 L50 70 L82 54 L82 48 L50 64 L18 54 Z" fill="#FFFBEB"/>
        <!-- スポンジ間クリームと苺スライス -->
        <circle cx="34" cy="64" r="3" fill="#EF4444"/>
        <circle cx="64" cy="58" r="3" fill="#EF4444"/>
        <!-- 上面ホワイト純生クリーム -->
        <path d="M18 52 L50 62 L82 46 L50 36 Z" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="1.5"/>
        <path d="M18 52 Q34 60 50 62 Q66 54 82 46 Q66 40 50 36 Q34 44 18 52 Z" fill="#FFF" />
        <!-- 絞りクリーム -->
        <circle cx="36" cy="46" r="5" fill="#FFFFFF" stroke="#FEE2E2" stroke-width="1"/>
        <circle cx="62" cy="42" r="5" fill="#FFFFFF" stroke="#FEE2E2" stroke-width="1"/>
        <!-- トッピングの苺 -->
        <path d="M50 32 C42 32 40 44 50 50 C60 44 58 32 50 32 Z" fill="#DC2626"/>
        <path d="M48 31 C46 29 44 29 46 27 C49 28 50 30 50 31 Z" fill="#16A34A"/>
        <path d="M52 31 C54 29 56 29 54 27 C51 28 50 30 50 31 Z" fill="#15803D"/>
        <!-- 苺の種ハイライト -->
        <circle cx="47" cy="38" r="0.8" fill="#FEE2E2"/>
        <circle cx="53" cy="39" r="0.8" fill="#FEE2E2"/>
        <circle cx="50" cy="44" r="0.8" fill="#FEE2E2"/>
      </svg>
    `,
    chocolate: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FEF2F2" opacity="0.7"/>
        <!-- ガトーショコラ本体 -->
        <path d="M20 68 L50 78 L80 62 L80 44 L50 60 L20 50 Z" fill="#3B1E13" stroke="#23130C" stroke-width="1.5"/>
        <!-- 濃厚チョコスポンジ側面質感 -->
        <path d="M20 59 L50 69 L80 53 L80 47 L50 63 L20 53 Z" fill="#4A2518"/>
        <!-- 上面グラサージュ・ショコラ -->
        <path d="M20 50 L50 60 L80 44 L50 34 Z" fill="#2E140C" stroke="#1D0A04" stroke-width="1"/>
        <!-- チョコのつや・ハイライト -->
        <path d="M30 48 L48 54 L68 43" stroke="#78350F" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        <!-- 添えられた純白ホイップクリーム -->
        <path d="M52 38 C52 34 58 32 60 36 C64 33 68 37 66 41 C64 43 56 44 52 38 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
        <!-- ミントの葉 -->
        <ellipse cx="64" cy="33" rx="4" ry="2.5" transform="rotate(-25 64 33)" fill="#15803D"/>
      </svg>
    `,
    cheesecake: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FEFCE8" opacity="0.8"/>
        <!-- ケーキ側面（なめらかクリームチーズ色） -->
        <path d="M20 68 L50 78 L80 62 L80 44 L50 60 L20 50 Z" fill="#FEF08A" stroke="#EAB308" stroke-width="1.2"/>
        <path d="M20 59 L50 69 L80 53 L80 49 L50 64 L20 54 Z" fill="#FDE047" opacity="0.7"/>
        <!-- バスク特有のこんがり焦げ目カラメル上面 -->
        <path d="M20 50 L50 60 L80 44 L50 34 Z" fill="#78350F" stroke="#451A03" stroke-width="1.5"/>
        <path d="M26 49 C38 55 45 53 52 56 C62 50 70 45 74 44 C65 39 52 36 44 38 C32 40 26 46 26 49 Z" fill="#451A03"/>
        <!-- とろりとした中心のチーズハイライト -->
        <ellipse cx="50" cy="62" rx="6" ry="2.5" fill="#FEF9C3" opacity="0.8"/>
      </svg>
    `,
    tart: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FFF7ED" opacity="0.8"/>
        <!-- タルト台座（パート・シュクレ） -->
        <path d="M20 68 Q50 82 80 68 L78 58 Q50 70 22 58 Z" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
        <ellipse cx="50" cy="58" rx="28" ry="12" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5"/>
        <!-- カスタードクリーム層 -->
        <ellipse cx="50" cy="56" rx="24" ry="9" fill="#FDE68A"/>
        <!-- 色鮮やかなフルーツトッピング -->
        <!-- 苺 -->
        <circle cx="48" cy="52" r="7" fill="#EF4444"/>
        <circle cx="48" cy="52" r="6" fill="#DC2626"/>
        <circle cx="46" cy="50" r="1" fill="#FEF2F2"/>
        <!-- ブルーベリー -->
        <circle cx="36" cy="56" r="4.5" fill="#3730A3"/>
        <circle cx="62" cy="54" r="4.5" fill="#312E81"/>
        <circle cx="37" cy="55" r="1" fill="#818CF8"/>
        <!-- キウイ / マスカット -->
        <circle cx="58" cy="48" r="4.5" fill="#84CC16"/>
        <circle cx="38" cy="48" r="4" fill="#F97316"/>
        <!-- つや出しナパージュ -->
        <path d="M42 46 Q50 42 58 46" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      </svg>
    `,
    canele: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FEF3C7" opacity="0.6"/>
        <!-- カヌレのお皿・影 -->
        <ellipse cx="50" cy="78" rx="28" ry="8" fill="#E2E8F0" opacity="0.6"/>
        <!-- カヌレ本体（クラシックな溝・焼き色） -->
        <path d="M34 40 L30 72 Q50 78 70 72 L66 40 Q50 36 34 40 Z" fill="#3B1E13" stroke="#23130C" stroke-width="1.5"/>
        <!-- 溝の立体感リブ -->
        <path d="M37 40 L35 73" stroke="#23130C" stroke-width="2.5"/>
        <path d="M43 39 L42 75" stroke="#54291B" stroke-width="2.5"/>
        <path d="M50 38 L50 76" stroke="#23130C" stroke-width="2.5"/>
        <path d="M57 39 L58 75" stroke="#54291B" stroke-width="2.5"/>
        <path d="M63 40 L65 73" stroke="#23130C" stroke-width="2.5"/>
        <!-- トップのくぼみ・蜜蝋のツヤ -->
        <ellipse cx="50" cy="40" rx="16" ry="6" fill="#2E140C" stroke="#1D0A04" stroke-width="1.5"/>
        <ellipse cx="50" cy="40" rx="6" ry="2.5" fill="#1D0A04"/>
        <path d="M42 38 Q50 36 56 38" stroke="#A16207" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
      </svg>
    `,
    cookie: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FFFBEB" opacity="0.8"/>
        <!-- フィナンシェ（長方形の黄金色焼き菓子） -->
        <rect x="22" y="44" width="36" height="24" rx="4" transform="rotate(-15 22 44)" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
        <rect x="25" y="46" width="30" height="20" rx="2" transform="rotate(-15 25 46)" fill="#F59E0B"/>
        <!-- サクサクチョコチップクッキー -->
        <circle cx="62" cy="52" r="20" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="54" cy="44" r="2.5" fill="#451A03"/>
        <circle cx="66" cy="42" r="3" fill="#451A03"/>
        <circle cx="72" cy="52" r="2.5" fill="#451A03"/>
        <circle cx="60" cy="56" r="3" fill="#451A03"/>
        <circle cx="54" cy="62" r="2" fill="#451A03"/>
        <circle cx="68" cy="62" r="2.5" fill="#451A03"/>
      </svg>
    `,
    pudding: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FEFCE8" opacity="0.8"/>
        <!-- デザートガラスプレート -->
        <ellipse cx="50" cy="76" rx="36" ry="10" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="1.5"/>
        <ellipse cx="50" cy="74" rx="30" ry="7" fill="#F8FAFC"/>
        <!-- カスタードプリン本体 -->
        <path d="M34 46 L26 70 Q50 76 74 70 L66 46 Z" fill="#FDE047" stroke="#EAB308" stroke-width="1.5"/>
        <!-- カラメルソース（上部と垂れるソース） -->
        <ellipse cx="50" cy="46" rx="16" ry="6" fill="#78350F"/>
        <path d="M34 46 Q38 56 42 52 Q46 58 50 46 Q54 55 58 49 Q62 56 66 46 Z" fill="#78350F"/>
        <!-- ホイップクリーム -->
        <circle cx="50" cy="38" r="6" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="1"/>
        <circle cx="47" cy="37" r="4" fill="#FFFFFF"/>
        <!-- さくらんぼ -->
        <circle cx="53" cy="32" r="4" fill="#DC2626"/>
        <path d="M54 30 Q60 22 66 22" stroke="#15803D" stroke-width="1.5" stroke-linecap="round"/>
        <!-- お皿に広がるカラメル -->
        <ellipse cx="50" cy="71" rx="20" ry="4" fill="#92400E" opacity="0.6"/>
      </svg>
    `,
    coffee: `
      <svg class="product-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#FEF3C7" opacity="0.6"/>
        <!-- ソーサー（受け皿） -->
        <ellipse cx="50" cy="76" rx="32" ry="8" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5"/>
        <!-- マグカップ本体 -->
        <path d="M30 42 H70 V62 C70 70 60 74 50 74 C40 74 30 70 30 62 Z" fill="#F8FAFC" stroke="#64748B" stroke-width="2"/>
        <!-- 取っ手 -->
        <path d="M70 48 Q82 48 82 56 Q82 64 70 64" fill="none" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
        <!-- 芳醇な珈琲表面 & ラテアート（ハート） -->
        <ellipse cx="50" cy="43" rx="19" ry="6" fill="#451A03"/>
        <path d="M50 44 C48 41 44 41 44 43 C44 46 50 48 50 48 C50 48 56 46 56 43 C56 41 52 41 50 44 Z" fill="#FEF3C7"/>
        <!-- 立ちのぼるアロマの湯気 -->
        <path d="M42 32 Q40 24 46 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        <path d="M52 34 Q54 26 50 20" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        <path d="M60 30 Q58 24 62 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      </svg>
    `,
    // レガシーキーのフォールバック
    lamp: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#FEF3C7"/></svg>`,
    plant: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#DCFCE7"/></svg>`,
    sound: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#E0E7FF"/></svg>`,
    tumbler: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#F1F5F9"/></svg>`,
    keyboard: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#F3E8FF"/></svg>`,
    diffuser: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#FCE7F3"/></svg>`,
    wallet: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#FEF3C7"/></svg>`,
    poster: `<svg class="product-svg-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#CFFAFE"/></svg>`
  };

  return svgs[imageKey] || svgs.cake;
};

window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
};

window.formatCurrency = function(amount) {
  return '¥' + Number(amount).toLocaleString('ja-JP');
};
