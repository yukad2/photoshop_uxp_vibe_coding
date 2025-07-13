// Texture Packing Tool - Photoshop UXP Plugin

const { app } = require('photoshop');

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

// R:AO Createボタンのイベントリスナー
document.getElementById('create-ao-btn').addEventListener('click', async () => {
    try {
        const doc = checkActiveDocument();
        if (!doc) return;

        displayResult('R_AO レイヤーグループを作成中...', 'info');
        
        // TODO: レイヤーグループ作成ロジックを実装
        // 一時的なプレースホルダー
        setTimeout(() => {
            displayResult('R_AO (Ambient Occlusion) レイヤーグループが作成されました', 'success');
        }, 500);
        
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
        
        // TODO: レイヤーグループ作成ロジックを実装
        // 一時的なプレースホルダー
        setTimeout(() => {
            displayResult('G_Roughness レイヤーグループが作成されました', 'success');
        }, 500);
        
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
        
        // TODO: レイヤーグループ作成ロジックを実装
        // 一時的なプレースホルダー
        setTimeout(() => {
            displayResult('B_Metalness レイヤーグループが作成されました', 'success');
        }, 500);
        
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
        
        // TODO: エクスポート処理を実装
        // 一時的なプレースホルダー
        setTimeout(() => {
            displayResult('テクスチャパッキングが完了しました！', 'success');
        }, 1000);
        
    } catch (error) {
        displayResult(`エラー: ${error.message}`, 'error');
    }
});

// プラグインの初期化
document.addEventListener('DOMContentLoaded', () => {
    displayResult('テクスチャパッキングツールが準備できました。各ボタンをクリックして開始してください。', 'info');
});
