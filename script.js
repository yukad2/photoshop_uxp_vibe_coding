// Texture Packing Tool - Photoshop UXP Plugin

const { app, constants } = require('photoshop');

// 出力エリアの参照
const output = document.getElementById('output');

// 結果を表示する関数
function displayResult(message, type = 'info') {
    output.innerHTML = `<p class="${type}">${message}</p>`;
}

// アクティブドキュメントをチェックする関数
function checkActiveDocument() {
    const activeDocument = app.activeDocument;
    if (!activeDocument) {
        displayResult('アクティブなドキュメントがありません。Photoshopでドキュメントを開いてください。', 'error');
        return null;
    }
    return activeDocument;
}

// レイヤーグループの重複チェック関数
async function checkLayerGroupExists(doc, groupName) {
    try {
        const layers = await doc.layers;
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer.name === groupName && layer.kind === 'group') {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('レイヤーグループ検索エラー:', error);
        return false;
    }
}

// レイヤーグループとベースレイヤーを作成する関数
async function createLayerGroup(doc, groupName, channelType) {
    try {
        // 重複チェック
        const exists = await checkLayerGroupExists(doc, groupName);
        if (exists) {
            displayResult(`警告: "${groupName}" グループは既に存在します。`, 'warning');
            return false;
        }

        // レイヤーの選択状態を解除してルートレベルでの作業を確保
        try {
            // 選択を解除（activeLayers を空にする）
            doc.activeLayers = [];
        } catch (error1) {
            try {
                // activeLayers が使えない場合は activeLayer を null に
                doc.activeLayer = null;
            } catch (error2) {
                // activeLayerをnullに設定できない場合は、最上位レイヤーを選択
                if (doc.layers.length > 0) {
                    doc.activeLayer = doc.layers[0];
                }
            }
        }

        // レイヤーグループを作成（ルートレベルに作成される）
        const groupOptions = { name: groupName };
        const layerGroup = await doc.createLayerGroup(groupOptions);
        
        // ベースの白レイヤーを作成（ドキュメントレベルで作成）
        const layerOptions = { name: `${channelType}_Base` };
        const baseLayer = await doc.createPixelLayer(layerOptions);
        
        await baseLayer.move(layerGroup, "placeInside");
        
        // 作成したグループを選択状態にする
        doc.activeLayer = layerGroup;
        
        return true;
    } catch (error) {
        console.error('レイヤーグループ作成エラー:', error);
        throw error;
    }
}

// R:AO Createボタンのイベントリスナー
document.getElementById('create-ao-btn').addEventListener('click', async () => {
    try {
        const doc = checkActiveDocument();
        if (!doc) return;

        displayResult('R_AO レイヤーグループを作成中...', 'info');
        
        await require('photoshop').core.executeAsModal(async () => {
            const success = await createLayerGroup(doc, 'R_AO', 'AO');
            if (success) {
                displayResult('R_AO (Ambient Occlusion) レイヤーグループが作成されました。', 'success');
            }
        }, {
            commandName: 'Create R_AO Layer Group'
        });
        
    } catch (error) {
        displayResult(`エラー: ${error.message}`, 'error');
    }
});

// G:Rough Createボタンのイベントリスナー
document.getElementById('create-rough-btn').addEventListener('click', async () => {
    try {
        const doc = checkActiveDocument();
        if (!doc) return;

        displayResult('G_Roughness レイヤーグループを作成中...', 'info');
        
        await require('photoshop').core.executeAsModal(async () => {
            const success = await createLayerGroup(doc, 'G_Roughness', 'Roughness');
            if (success) {
                displayResult('G_Roughness レイヤーグループが作成されました。', 'success');
            }
        }, {
            commandName: 'Create G_Roughness Layer Group'
        });
        
    } catch (error) {
        displayResult(`エラー: ${error.message}`, 'error');
    }
});

// B:Metal Createボタンのイベントリスナー
document.getElementById('create-metal-btn').addEventListener('click', async () => {
    try {
        const doc = checkActiveDocument();
        if (!doc) return;

        displayResult('B_Metalness レイヤーグループを作成中...', 'info');
        
        await require('photoshop').core.executeAsModal(async () => {
            const success = await createLayerGroup(doc, 'B_Metalness', 'Metalness');
            if (success) {
                displayResult('B_Metalness レイヤーグループが作成されました。', 'success');
            }
        }, {
            commandName: 'Create B_Metalness Layer Group'
        });
        
    } catch (error) {
        displayResult(`エラー: ${error.message}`, 'error');
    }
});

// Exportボタンのイベントリスナー
document.getElementById('export-btn').addEventListener('click', async () => {
    try {
        const doc = checkActiveDocument();
        if (!doc) return;

        displayResult('テクスチャパッキングを開始中...', 'info');
        
        // エクスポート処理は今後実装予定
        displayResult('エクスポート機能は未実装です。Phase 3で実装予定です。', 'warning');
        
    } catch (error) {
        displayResult(`エラー: ${error.message}`, 'error');
    }
});

// プラグインの初期化
document.addEventListener('DOMContentLoaded', () => {
    displayResult('テクスチャパッキングツールが準備できました。各ボタンをクリックして開始してください。', 'info');
});
