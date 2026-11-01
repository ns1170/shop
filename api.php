<?php
/**
 * WonderMarket API - 商品・注文データ管理
 * JavaScriptから呼び出され、JSONベースでCRUD操作を行います。
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data/products.json';
$ordersFile = __DIR__ . '/data/orders.json';

// ヘルパー: JSONファイルの読み込み
function readJson($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    $content = file_get_contents($filePath);
    return json_decode($content, true) ?: [];
}

// ヘルパー: JSONファイルの書き込み
function writeJson($filePath, $data) {
    return file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        // ==========================
        // 商品 API
        // ==========================
        case 'products':
            if ($method === 'GET') {
                $products = readJson($dataFile);
                echo json_encode(['success' => true, 'data' => $products]);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (!$input || empty($input['name'])) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => '商品名などの必須項目が不足しています']);
                    exit;
                }

                $products = readJson($dataFile);
                $isUpdate = false;

                if (!empty($input['id'])) {
                    // 更新
                    foreach ($products as &$p) {
                        if ($p['id'] === $input['id']) {
                            $p = array_merge($p, $input);
                            $isUpdate = true;
                            break;
                        }
                    }
                }

                if (!$isUpdate) {
                    // 新規追加
                    $newProduct = [
                        'id' => 'prod_' . round(microtime(true) * 1000),
                        'name' => htmlspecialchars($input['name'], ENT_QUOTES, 'UTF-8'),
                        'category' => $input['category'] ?? 'cake',
                        'categoryName' => $input['categoryName'] ?? '生ケーキ・タルト',
                        'price' => (int)($input['price'] ?? 0),
                        'stock' => (int)($input['stock'] ?? 0),
                        'description' => htmlspecialchars($input['description'] ?? '', ENT_QUOTES, 'UTF-8'),
                        'featured' => !empty($input['featured']),
                        'rating' => 5.0,
                        'reviewCount' => 0,
                        'badge' => $input['badge'] ?? 'NEW',
                        'image' => $input['image'] ?? 'cake'
                    ];
                    $products[] = $newProduct;
                }

                writeJson($dataFile, $products);
                echo json_encode(['success' => true, 'data' => $products]);
            } elseif ($method === 'DELETE') {
                $id = $_GET['id'] ?? '';
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'IDが指定されていません']);
                    exit;
                }

                $products = readJson($dataFile);
                $products = array_values(array_filter($products, function($p) use ($id) {
                    return $p['id'] !== $id;
                }));

                writeJson($dataFile, $products);
                echo json_encode(['success' => true, 'data' => $products]);
            }
            break;

        // ==========================
        // 注文 API
        // ==========================
        case 'orders':
            if ($method === 'GET') {
                $orders = readJson($ordersFile);
                echo json_encode(['success' => true, 'data' => $orders]);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (!$input || empty($input['items'])) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => '注文内容が空です']);
                    exit;
                }

                $orders = readJson($ordersFile);
                $products = readJson($dataFile);

                // 在庫数を減算
                foreach ($input['items'] as $item) {
                    foreach ($products as &$prod) {
                        if ($prod['id'] === $item['id']) {
                            $prod['stock'] = max(0, $prod['stock'] - $item['quantity']);
                            break;
                        }
                    }
                }
                writeJson($dataFile, $products);

                $newOrder = [
                    'id' => 'ord_' . (count($orders) + 1001),
                    'customer' => [
                        'name' => htmlspecialchars($input['customer']['name'] ?? 'ゲスト', ENT_QUOTES, 'UTF-8'),
                        'email' => htmlspecialchars($input['customer']['email'] ?? '', ENT_QUOTES, 'UTF-8'),
                        'address' => htmlspecialchars($input['customer']['address'] ?? '', ENT_QUOTES, 'UTF-8')
                    ],
                    'items' => $input['items'],
                    'total' => (int)($input['total'] ?? 0),
                    'status' => 'pending',
                    'createdAt' => date('Y-m-d H:i:s')
                ];

                array_unshift($orders, $newOrder);
                writeJson($ordersFile, $orders);

                echo json_encode(['success' => true, 'data' => $newOrder]);
            }
            break;

        // ==========================
        // 注文ステータス更新 API
        // ==========================
        case 'update_order_status':
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $orderId = $input['id'] ?? '';
                $newStatus = $input['status'] ?? '';

                if (!$orderId || !$newStatus) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'パラメータ不足']);
                    exit;
                }

                $orders = readJson($ordersFile);
                foreach ($orders as &$order) {
                    if ($order['id'] === $orderId) {
                        $order['status'] = $newStatus;
                        break;
                    }
                }

                writeJson($ordersFile, $orders);
                echo json_encode(['success' => true, 'data' => $orders]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Unknown action: ' . htmlspecialchars($action)]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
