# Photoshop UXP Plugin

Photoshop用のモダンなUXPプラグインプロジェクトです。

## 概要

このプラグインはAdobe PhotoshopのUXP（Unified Extensibility Platform）を使用して開発されています。HTML、CSS、JavaScriptを使用してPhotoshopの機能を拡張できます。

## 機能

- **Hello World**: 基本的なプラグイン動作確認
- **レイヤー情報取得**: アクティブドキュメントのレイヤー情報を表示
- **新しいレイヤー作成**: プログラムでレイヤーを作成

## プロジェクト構造

```
photoshop_uxp/
├── manifest.json      # プラグイン設定ファイル
├── index.html         # メインUI
├── script.js          # プラグインロジック
├── styles.css         # UIスタイル
├── package.json       # Node.js設定
└── README.md          # このファイル
```

## 開発環境のセットアップ

### 必要なツール

1. **Adobe UXP Developer Tool**: Adobeの公式開発ツール
2. **Visual Studio Code**: 推奨エディター
3. **Photoshop 2023以降**: プラグインのテスト環境

### インストール手順

1. UXP Developer Toolのダウンロード:
   - [Adobe Developer Console](https://developer.adobe.com/)からダウンロード

2. プラグインの読み込み:
   ```
   UXP Developer Tool > Add Plugin > このプロジェクトフォルダを選択
   ```

3. Photoshopでのテスト:
   - Photoshopを起動
   - UXP Developer Toolで「Load」をクリック
   - Photoshopのプラグインパネルから「My Plugin Panel」を開く

## 開発ガイド

### manifest.json
プラグインの基本設定と権限を定義します：
- アプリケーション対応（Photoshop）
- 最小バージョン要件
- UI設定
- 必要な権限

### Photoshop API の使用

#### 基本的なDOM API
```javascript
const { app } = require('photoshop');
const activeDocument = app.activeDocument;
const layers = activeDocument.layers;
```

#### 高度なbatchPlay API
```javascript
await app.batchPlay([{
    "_obj": "make",
    "_target": [{"_ref": "layer"}],
    "using": {"_obj": "layer", "name": "New Layer"}
}], {});
```

## デバッグとテスト

1. UXP Developer Toolのコンソールでエラーを確認
2. PhotoshopのアクションパネルでbatchPlayコードを記録
3. ブラウザの開発者ツールのような環境でデバッグ可能

## パッケージング

プラグインを配布用にパッケージするには：
1. UXP Developer Toolで「Package」を使用
2. 生成された.ccxファイルを配布

## 参考資料

- [UXP for Photoshop Documentation](https://developer.adobe.com/photoshop/uxp/)
- [Photoshop API Reference](https://developer.adobe.com/photoshop/uxp/2022/ps_reference/)
- [UXP Samples](https://github.com/AdobeDocs/uxp-photoshop-samples)

## ライセンス

MIT License
