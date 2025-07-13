# Texture Packing Tool - Photoshop UXP Plugin

テクスチャマップ（AO, Roughness, Metalness）を効率的にパッキングするPhotoshop UXPプラグインです。

## 概要

このプラグインは3Dテクスチャ作成ワークフローを効率化するために設計されています。Ambient Occlusion、Roughness、Metalnessの各マップを個別のチャンネルに分けて管理し、最終的にRGBチャンネルにパッキングして出力できます。

## 主要機能

### Phase 3完了機能 ✅

- **R:AO Create**: Ambient Occlusion用レイヤーグループ作成
- **G:Rough Create**: Roughness用レイヤーグループ作成  
- **B:Metal Create**: Metalness用レイヤーグループ作成
- **Export**: 高度なRGBチャンネル合成エクスポート機能

### Export機能の特徴

1. **レイヤーグループの自動検証**: 必要なグループ（R_AO、G_Roughness、B_Metalness）の存在確認
2. **エクスポートモード選択**: 
   - 簡易エクスポート: 基本的なグループ複製
   - 高度なエクスポート: チャンネル別マッピングと最適化
3. **新規ドキュメント作成**: パッキング結果を新しいドキュメントで管理
4. **インタラクティブな進行状況表示**: リアルタイムでの処理状況確認

## 使用方法

### 基本ワークフロー

1. **チャンネル作成段階**:
   - 各Createボタンでレイヤーグループを作成
   - 各グループ内でテクスチャマップを作成・編集

2. **エクスポート段階**:
   - Exportボタンをクリック
   - エクスポートモードを選択（高度なエクスポート推奨）
   - 新しいドキュメントでパッキング結果を確認

3. **最終調整**:
   - 必要に応じてレイヤーを結合
   - Photoshopの「ファイル → 保存」で最終テクスチャを保存

### チャンネルマッピング

- **Rチャンネル**: Ambient Occlusion (R_AO)
- **Gチャンネル**: Roughness (G_Roughness)  
- **Bチャンネル**: Metalness (B_Metalness)

## 技術仕様

## プロジェクト構造

```
texture_packing_tool/
├── manifest.json      # プラグイン設定（ファイルシステム権限含む）
├── index.html         # メインUI（4つのボタンレイアウト）
├── script.js          # エクスポート機能とレイヤー管理ロジック
├── styles.css         # チャンネル別色分けとレスポンシブUI
├── package.json       # Node.js設定
├── plan.md           # 開発計画書
└── README.md         # このファイル
```

### 使用API

- **Photoshop DOM API**: レイヤーグループ作成・管理
- **UXP File System API**: ファイル保存機能（manifest.jsonで権限設定）
- **executeAsModal**: 安全なPhotoshop操作実行

### エラーハンドリング

- アクティブドキュメント存在確認
- レイヤーグループ重複検出と警告
- エクスポート時の必須グループ存在確認
- 詳細なエラーメッセージとロギング

## 技術制約

- **batchPlay APIは未使用**: 複雑すぎるため、DOM APIのみを使用
- **手動チャンネル合成**: UXP APIの制限により、最終的なピクセル操作は手動
- **クロスプラットフォーム対応**: Windows/Mac両対応

## Phase 3実装完了項目

✅ レイヤーグループ存在確認機能  
✅ 簡易エクスポート機能（グループ複製）  
✅ 高度なエクスポート機能（チャンネルマッピング）  
✅ エクスポートモード選択ダイアログ  
✅ 新規ドキュメント作成とレイヤー管理  
✅ リアルタイム進行状況表示  
✅ エラーハンドリング強化  
✅ ユーザー向け操作指示表示  
✅ マニフェストのファイルシステム権限設定

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
