#!/bin/bash
# WonderMarket 起動スクリプト
# 使い方: bash start.sh

cd "$(dirname "$0")"

echo "=============================="
echo " WonderMarket を起動しています..."
echo "=============================="

# 既存のプロセスを停止
pkill -f "python3.*server.py" 2>/dev/null

# Python3 が入っているか確認
if ! command -v python3 &> /dev/null; then
    echo "❌ python3 がインストールされていません"
    echo "   https://www.python.org/ からインストールしてください"
    exit 1
fi

# サーバー起動
python3 server.py
