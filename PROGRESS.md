# 📋 プロジェクト進捗状況 (WonderMarket)

## 📌 作業基本情報
- **作業ディレクトリ**: `/var/www/shop`
- **リポジトリ名**: WonderMarket
- **使用技術**: Python 3 (標準ライブラリ), HTML5, CSS3, JavaScript (ES6+)

---

## ✅ 完了したタスク
- [x] プロジェクト構成の設計（購入者画面・販売者画面の分離）
- [x] データ管理層の実装（`api.php` RESTful API & `js/store.js` LocalStorage 自動ハイブリッド同期）
- [x] 初期商品データ8種の設定（`data/products.json` & SVGベクターイラスト内蔵）
- [x] 初期注文データの設定（`data/orders.json`）
- [x] 購入者向け画面の実装（`buyer.html`, `buyer.php`, `css/buyer.css`, `js/buyer.js`）
  - 商品カタログ一覧表示、キーワード検索、カテゴリ絞り込み、並び替え
  - 商品詳細モーダル
  - カートドロワー（数量変更・削除・合計計算）
  - チェックアウト＆デモ注文決済、サンクスページ演出
- [x] 販売者向けダッシュボードの実装（`seller.html`, `seller.php`, `css/seller.css`, `js/seller.js`）
  - 売上KPI・注文数・在庫僅少サマリー
  - 出品商品管理（新規登録、編集、在庫直接増減、削除）
  - 注文・発送管理（受注一覧、ステータス変更: 受付/準備中/発送済/キャンセル）
  - 売上推移グラフ・カテゴリ比率分析
  - デモデータ初期化ボタン
- [x] メインリダイレクト設定（`index.html`, `index.php`）
- [x] ドキュメント作成（`README.md` にGitHub Pages公開手順・PHP起動手順を記載）
- [x] 作業ディレクトリを `/var/www/serminar` に移動完了

---

## 🚀 次回以降に着手可能なタスク案
- [ ] GitHubリポジトリの初期化と初コミット (`git init` / `git push`)
- [ ] GitHub Pagesへのデプロイ確認
- [ ] 決済機能の拡張（Stripe等のモック連携や支払い方法選択）
- [ ] レビュー投稿機能（購入者が星評価とコメントを追加できる機能）
- [ ] 管理者認証機能（販売者画面への簡易パスワードログイン）
- [ ] デザインや配色のカスタマイズ
