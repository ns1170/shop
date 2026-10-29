# 🛍️ WonderMarket (ワンダーマーケット)
> Python & モダンWeb標準で構築された、デュアルモード型ECプラットフォーム

ブラウザから `http://localhost` にアクセスするだけで即座に起動し、購入者向けショップと販売者向け管理ダッシュボードを自由に行き来できるショッピングサイトです。外部ライブラリ（pip等）への依存が一切なく、GitHub Pagesでの無料Web公開にも完全対応しています。

---

## 🌟 特徴

- **ポート80で即時起動 (`http://localhost`)**: ポート番号の指定なしで、本物のWebサイトのようにアクセス可能。
- **依存ライブラリ ゼロ**: Python 3 標準ライブラリのみで動作。`pip install` や `npm install` の面倒な環境構築は不要。
- **購入者 ⇄ 販売者の二重モード**:
  - 🛒 **購入者モード**: 商品カタログ、リアルタイム検索、カテゴリ抽出、カート、疑似決済。
  - 📊 **販売者モード**: 売上KPI、出品商品の登録・編集・在庫増減、受注・配送ステータス管理、売上分析グラフ。
- **完全なデータ連動 & 安全な疑似決済**:
  - 注文すると販売者の受注一覧に即時反映され、在庫が自動で減算されます。
  - クレジットカード決済や外部課金は一切発生しない安全なシミュレーション設計。
- **GitHub Pages デプロイ対応**:
  - サーバーがない静的ホスティング環境では、自動的にブラウザ内 `localStorage` で動作するハイブリッド設計。

---

## 📋 動作要件 (前提条件)

- **OS**: Linux / macOS / Windows (WSL2)
- **ランタイム**: Python 3.8 以上 (Python 3.10 / 3.12 / 3.14 動作確認済)
- **Webブラウザ**: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge 等のモダンブラウザ

---

## 🚀 インストール & 起動手順 (3ステップ)

### ステップ 1: リポジトリの準備
```bash
# 作業ディレクトリへ移動
cd /var/www/shop
```

### ステップ 2: サーバーの起動
ポート80（特権ポート）で起動するため、`sudo` を付けて起動します：
```bash
# ポート80で起動 (推奨)
sudo python3 server.py
```

※もし管理者権限（sudo）を使わずに一般ポート（例: 8080）で動かしたい場合は、以下のように環境変数 `PORT` を指定して起動できます：
```bash
PORT=8080 python3 server.py
# この場合は http://localhost:8080 でアクセスします
```

### ステップ 3: ブラウザでアクセス
ブラウザを開き、以下のアドレスにアクセスしてください：

| 画面 | アクセスURL | 説明 |
| :--- | :--- | :--- |
| 🛒 **購入者向けストア** | **`http://localhost`** | 商品閲覧、検索、カート、デモ注文 |
| 📊 **販売者ダッシュボード** | **`http://localhost/seller`** | 在庫管理、新規出品、注文・発送管理 |

※画面上部のボタンスイッチで、いつでも自由に画面を切り替えられます。

---

## 📦 取り扱い商品ラインナップ (初期搭載)

高品質なSVGベクターイラストを内蔵しており、画像のリンク切れがありません。
1. **量子浮遊テラリウム (LED照明内蔵)** (¥14,800) - 超伝導磁気浮遊で宙に浮くポット
2. **サイバーパンク・メカニカルキーボード (65%)** (¥19,500) - 蓄光レジン＆アルミ筐体
3. **アンビエント音響ジェネレーター** (¥11,200) - 集中と睡眠のアナログ環境音マシン
4. **チタン製真空サーモボトル (500ml)** (¥5,400) - 航空宇宙チタン製、超軽量145g
5. **レトロフューチャー LEDデスクランプ** (¥8,900) - 80年代SFヴィンテージ照明
6. **オーロラ・プリズム アロマディフューザー** (¥6,300) - 虹色に光る多面体ガラス
7. **モジュラー磁気レザーウォレット** (¥7,600) - マグネット脱着式スマート本革財布
8. **蓄光レンチキュラー アートポスター A2** (¥3,500) - 角度で絵が変わるホログラムアート

---

## 🌐 GitHubへの公開手順 (GitHub Pages)

本リポジトリは、GitHub Pagesにプッシュするだけで世界中に無料公開できます。

```bash
# 1. Git初期化とコミット
cd /var/www/serminar
git init
git add .
git commit -m "feat: Initial commit - WonderMarket EC Platform"

# 2. GitHubリモートリポジトリへプッシュ
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
git push -u origin main
```

### GitHub Pagesの有効化設定:
1. GitHubのリポジトリページで **Settings** > **Pages** を開きます。
2. **Source** で `Deploy from a branch` を選択。
3. **Branch** を `main`、フォルダを `/ (root)` に設定して **Save** をクリックします。
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で世界中に公開されます！

---

## 🔌 REST API エンドポイント一覧

ローカルサーバー実行時は、以下のRESTful APIエンドポイントを利用可能です：

| メソッド | パス | 説明 |
| :--- | :--- | :--- |
| `GET` | `/api/products` | 商品一覧の取得 |
| `POST` | `/api/products` | 商品の新規追加または更新 |
| `DELETE` | `/api/products?id=<ID>` | 指定商品の削除 |
| `GET` | `/api/orders` | 注文一覧の取得 |
| `POST` | `/api/orders` | 新規注文の作成（在庫数を自動減算） |
| `PATCH` | `/api/orders` | 注文ステータスの更新 (`pending`, `processing`, `shipped`, `cancelled`) |
| `POST` | `/api/reset` | 商品・注文データを初期デモ状態にリセット |

---

## 📄 技術ドキュメント (LaTeX)

本Webアプリのアーキテクチャ・設計に関する技術報告書（A4・1ページ・2段組・余白1インチ・日本語）が同梱されています。

- ファイル名: [`document.tex`](document.tex)
- **コンパイル方法**:
  ```bash
  # LuaLaTeXを使用する場合
  lualatex document.tex

  # または uplatex + dvipdfmx を使用する場合
  uplatex document.tex
  dvipdfmx document.dvi
  ```
  ※[Overleaf](https://www.overleaf.com/) に `document.tex` をアップロードしてコンパイルすることも可能です。

---

## 📁 ディレクトリ構成

```
serminar/
├── server.py              # Python 3 標準ライブラリによるポート80 Web&APIサーバー
├── README.md              # 本インストールマニュアル
├── document.tex           # LaTeX仕様書 (A4・1ページ・2段組・余白1インチ・日本語)
├── PROGRESS.md            # 開発進捗・タスク管理ファイル
├── .gitignore             # Git除外設定
├── index.html             # トップページ
├── buyer.html             # 購入者向けストア画面
├── seller.html            # 販売者向け管理ダッシュボード
├── data/
│   ├── products.json      # 商品データ永続化ファイル
│   └── orders.json        # 注文データ永続化ファイル
├── css/
│   ├── style.css          # 共通デザイン・変数・モーダル・トースト
│   ├── buyer.css          # カタログ・カート・チェックアウト用スタイル
│   └── seller.css         # 管理ダッシュボード・KPI・テーブル・グラフ用スタイル
└── js/
    ├── store.js           # Python API ⇄ LocalStorage ハイブリッド同期層
    ├── buyer.js           # 購入者画面コントローラー
    └── seller.js          # 販売者画面コントローラー
```
