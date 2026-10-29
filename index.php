<?php
/**
 * WonderMarket - メインエントリーポイント
 * モード (buyer / seller) に応じて適切な画面を表示します。
 */

$mode = $_GET['mode'] ?? 'buyer';

if ($mode === 'seller') {
    include __DIR__ . '/seller.php';
} else {
    include __DIR__ . '/buyer.php';
}
