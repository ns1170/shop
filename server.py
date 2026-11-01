#!/usr/bin/env python3
"""
WonderMarket - Unified Web & REST API Server
Python 3 標準ライブラリのみで動作する軽量・高性能なWebサーバー。
ポート80 (http://localhost) で静的ファイル配信とREST APIを提供します。
"""

import os
import sys
import json
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime

# ポート決定: 環境変数 PORT > 80(root) > 8080(フォールバック)
import socket as _socket
def _get_port():
    p = int(os.environ.get("PORT", 80))
    if p != 80:
        return p
    s = _socket.socket(_socket.AF_INET, _socket.SOCK_STREAM)
    try:
        s.bind(("0.0.0.0", 80))
        s.close()
        return 80
    except OSError:
        s.close()
        print("[Info] Port 80 unavailable (requires root). Using 8080 instead.")
        return 8080
PORT = _get_port()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")

def load_json(filepath, default_value):
    if not os.path.exists(filepath):
        return default_value
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[Error] Failed to load {filepath}: {e}")
        return default_value

def save_json(filepath, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class WonderMarketHandler(BaseHTTPRequestHandler):
    server_version = "WonderMarket/2.0"

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_HEAD(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path in ["/", "", "/buyer", "/seller"]:
            file_path = os.path.join(BASE_DIR, "seller.html" if path == "/seller" else "buyer.html")
            mime_type, _ = mimetypes.guess_type(file_path)
            self.send_response(200)
            self.send_header("Content-Type", f"{mime_type}; charset=utf-8")
            self.send_cors_headers()
            self.end_headers()
        else:
            self.send_response(200)
            self.send_cors_headers()
            self.end_headers()

    def send_json(self, status_code, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        raw_body = self.rfile.read(content_length).decode("utf-8")
        try:
            return json.loads(raw_body)
        except json.JSONDecodeError:
            return {}

    # ==========================================
    # GET リクエスト処理
    # ==========================================
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        # REST API: 商品一覧
        if path == "/api/products":
            products = load_json(PRODUCTS_FILE, [])
            return self.send_json(200, {"success": True, "data": products})

        # REST API: 注文一覧
        if path == "/api/orders":
            orders = load_json(ORDERS_FILE, [])
            return self.send_json(200, {"success": True, "data": orders})

        # ルーティング短縮URL
        if path == "/" or path == "":
            return self.serve_file(os.path.join(BASE_DIR, "buyer.html"))
        elif path == "/seller":
            return self.serve_file(os.path.join(BASE_DIR, "seller.html"))
        elif path == "/buyer":
            return self.serve_file(os.path.join(BASE_DIR, "buyer.html"))
        elif path == "/document":
            return self.serve_file(os.path.join(BASE_DIR, "document.html"))

        # 静的ファイル配信
        clean_path = path.lstrip("/")
        file_path = os.path.join(BASE_DIR, clean_path)

        if os.path.exists(file_path) and os.path.isfile(file_path):
            return self.serve_file(file_path)

        # 見つからない場合
        self.send_json(404, {"error": "Not Found", "path": path})

    # ==========================================
    # POST リクエスト処理
    # ==========================================
    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # REST API: 商品追加・更新
        if path == "/api/products":
            payload = self.read_json_body()
            if not payload.get("name"):
                return self.send_json(400, {"success": False, "error": "商品名が必要です"})

            products = load_json(PRODUCTS_FILE, [])
            prod_id = payload.get("id")

            if prod_id:
                # 更新
                updated = False
                for i, p in enumerate(products):
                    if p.get("id") == prod_id:
                        products[i] = {**p, **payload}
                        updated = True
                        break
                if not updated:
                    products.append(payload)
            else:
                # 新規追加
                new_id = f"prod_{int(datetime.now().timestamp() * 1000)}"
                new_item = {
                    "id": new_id,
                    "name": payload.get("name"),
                    "category": payload.get("category", "cake"),
                    "categoryName": payload.get("categoryName", "生ケーキ・タルト"),
                    "price": int(payload.get("price", 0)),
                    "stock": int(payload.get("stock", 0)),
                    "description": payload.get("description", ""),
                    "featured": bool(payload.get("featured", False)),
                    "rating": 5.0,
                    "reviewCount": 0,
                    "badge": payload.get("badge", "NEW"),
                    "image": payload.get("image", "cake")
                }
                products.append(new_item)

            save_json(PRODUCTS_FILE, products)
            return self.send_json(200, {"success": True, "data": products})

        # REST API: 新規注文
        if path == "/api/orders":
            payload = self.read_json_body()
            items = payload.get("items", [])
            customer = payload.get("customer", {})
            total = payload.get("total", 0)

            if not items:
                return self.send_json(400, {"success": False, "error": "注文商品が空です"})

            orders = load_json(ORDERS_FILE, [])
            products = load_json(PRODUCTS_FILE, [])

            # 在庫を減算
            for it in items:
                for p in products:
                    if p.get("id") == it.get("id"):
                        p["stock"] = max(0, p.get("stock", 0) - it.get("quantity", 1))
                        break
            save_json(PRODUCTS_FILE, products)

            new_order = {
                "id": f"ord_{len(orders) + 1001}",
                "customer": customer,
                "items": items,
                "total": total,
                "status": "pending",
                "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            orders.insert(0, new_order)
            save_json(ORDERS_FILE, orders)

            return self.send_json(201, {"success": True, "data": new_order})

        # REST API: デモデータ初期化
        if path == "/api/reset":
            # デフォルト商品データをリセット
            default_products = [
                {
                    "id": "prod_001",
                    "name": "極上 苺のプレミアムショートケーキ",
                    "category": "cake",
                    "categoryName": "生ケーキ・タルト",
                    "price": 750,
                    "stock": 15,
                    "description": "国産の朝摘み苺と北海道産フレッシュ純生クリームを贅沢に使用。口どけのよいふわふわスポンジが絶品の大人気王道ショートケーキです。",
                    "featured": True,
                    "rating": 4.9,
                    "reviewCount": 48,
                    "badge": "人気No.1",
                    "image": "cake"
                },
                {
                    "id": "prod_002",
                    "name": "濃厚クラシック ベルギー生ガトーショコラ",
                    "category": "cake",
                    "categoryName": "生ケーキ・タルト",
                    "price": 720,
                    "stock": 12,
                    "description": "カカオ分72%の上質なベルギー産クーベルチュールチョコレートを贅沢に使用。低温でじっくり焼き上げた濃厚でとろける舌触り。",
                    "featured": True,
                    "rating": 4.9,
                    "reviewCount": 36,
                    "badge": "定番",
                    "image": "chocolate"
                },
                {
                    "id": "prod_003",
                    "name": "焦がしキャラメル バスクチーズケーキ",
                    "category": "cake",
                    "categoryName": "生ケーキ・タルト",
                    "price": 780,
                    "stock": 14,
                    "description": "高温短時間で香ばしく焼き上げたビターな表面と、中心部のとろりとなめらかで濃厚なクリームチーズのハーモニーが絶妙です。",
                    "featured": True,
                    "rating": 5.0,
                    "reviewCount": 52,
                    "badge": "注目",
                    "image": "cheesecake"
                },
                {
                    "id": "prod_004",
                    "name": "彩り旬果実の贅沢タルト",
                    "category": "cake",
                    "categoryName": "生ケーキ・タルト",
                    "price": 850,
                    "stock": 10,
                    "description": "発酵バター香るサクサクの自家製パート・サブレに、バニラビーンズ香る特製カスタードと色鮮やかな旬のフルーツをたっぷり敷き詰めました。",
                    "featured": False,
                    "rating": 4.8,
                    "reviewCount": 29,
                    "badge": "おすすめ",
                    "image": "tart"
                },
                {
                    "id": "prod_005",
                    "name": "熟成ボルドー風 蜜蝋カヌレ (4個入)",
                    "category": "baked",
                    "categoryName": "焼き菓子・クッキー",
                    "price": 1300,
                    "stock": 20,
                    "description": "外側は蜜蝋でカリッと芳ばしく、内側はラム酒とマダガスカル産バニラが豊かに香るもっちりしっとり食感。毎朝店内で丁寧に焼き上げています。",
                    "featured": False,
                    "rating": 4.7,
                    "reviewCount": 33,
                    "badge": "焼きたて",
                    "image": "canele"
                },
                {
                    "id": "prod_006",
                    "name": "特製手焼き 発酵バターフィナンシェ＆クッキー缶",
                    "category": "baked",
                    "categoryName": "焼き菓子・クッキー",
                    "price": 2400,
                    "stock": 16,
                    "description": "フランス産AOP発酵バターと香ばしいシチリア産アーモンドプードルをふんだんに使用。芳醇な香りと上品な甘みの詰め合わせギフト。",
                    "featured": True,
                    "rating": 4.9,
                    "reviewCount": 41,
                    "badge": "ギフト",
                    "image": "cookie"
                },
                {
                    "id": "prod_007",
                    "name": "昔ながらのクラシック カスタードプリン",
                    "category": "dessert",
                    "categoryName": "プリン・デザート",
                    "price": 500,
                    "stock": 25,
                    "description": "新鮮な契約農家の卵と北海道十勝産牛乳を贅沢に使い、低温スチームで丁寧に蒸し上げた程よい固さの王道プリン。ほろ苦い手作りカラメルソース付き。",
                    "featured": False,
                    "rating": 4.8,
                    "reviewCount": 65,
                    "badge": "好評",
                    "image": "pudding"
                },
                {
                    "id": "prod_008",
                    "name": "自家焙煎 スペシャルティブレンド珈琲豆 (200g)",
                    "category": "drink",
                    "categoryName": "カフェ・ドリンク",
                    "price": 1600,
                    "stock": 30,
                    "description": "スイーツの美味しさを引き立てる当店特製の中深煎りブレンド。ダークチョコレートのような甘みと芳醇なアロマが心地よく広がります。",
                    "featured": False,
                    "rating": 4.8,
                    "reviewCount": 22,
                    "badge": "自家焙煎",
                    "image": "coffee"
                }
            ]
            save_json(PRODUCTS_FILE, default_products)
            return self.send_json(200, {"success": True, "message": "リセット完了", "data": default_products})

        self.send_json(404, {"error": "Endpoint not found"})

    # ==========================================
    # PATCH リクエスト処理 (注文ステータス更新など)
    # ==========================================
    def do_PATCH(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/orders":
            payload = self.read_json_body()
            order_id = payload.get("id")
            new_status = payload.get("status")

            if not order_id or not new_status:
                return self.send_json(400, {"success": False, "error": "IDとstatusが必要です"})

            orders = load_json(ORDERS_FILE, [])
            for o in orders:
                if o.get("id") == order_id:
                    o["status"] = new_status
                    break

            save_json(ORDERS_FILE, orders)
            return self.send_json(200, {"success": True, "data": orders})

        self.send_json(404, {"error": "Endpoint not found"})

    # ==========================================
    # DELETE リクエスト処理 (商品削除)
    # ==========================================
    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/products":
            prod_id = query.get("id", [None])[0]
            if not prod_id:
                return self.send_json(400, {"success": False, "error": "id parameter required"})

            products = load_json(PRODUCTS_FILE, [])
            products = [p for p in products if p.get("id") != prod_id]
            save_json(PRODUCTS_FILE, products)
            return self.send_json(200, {"success": True, "data": products})

        self.send_json(404, {"error": "Endpoint not found"})

    # ==========================================
    # 静的ファイル送信ヘルパー
    # ==========================================
    def serve_file(self, file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            if file_path.endswith(".js"):
                mime_type = "application/javascript"
            elif file_path.endswith(".css"):
                mime_type = "text/css"
            elif file_path.endswith(".json"):
                mime_type = "application/json"
            else:
                mime_type = "text/plain"

        try:
            with open(file_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", f"{mime_type}; charset=utf-8" if "text" in mime_type or "javascript" in mime_type or "json" in mime_type else mime_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_json(500, {"error": f"Failed to read file: {str(e)}"})

    def log_message(self, format, *args):
        # 簡潔なアクセスログ
        sys.stderr.write(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]} {args[1]}\n")

def run():
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, WonderMarketHandler)
    print("=" * 60)
    print(f"✨ WonderMarket Web & REST API Server")
    print(f"🚀 Running at: http://localhost (Port: {PORT})")
    print(f"📁 Document Root: {BASE_DIR}")
    print(f"🛒 Buyer URL:  http://localhost")
    print(f"📊 Seller URL: http://localhost/seller")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
