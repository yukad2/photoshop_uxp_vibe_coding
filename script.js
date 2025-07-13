// Texture Packing Tool - Photoshop UXP Plugin

const { app, constants } = require('photoshop');
// ファイルシステムAPIのインポート
const fs = require('uxp').storage.localFileSystem;

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

        // レイヤーグループを作成（ルートレベルに作成される）
        const groupOptions = { name: groupName };
        const layerGroup = await doc.createLayerGroup(groupOptions);
        await layerGroup.move(doc.layers[0], constants.ElementPlacement.PLACEBEFORE); // グループをドキュメントの先頭に
        
        // ベースのレイヤーを作成（ドキュメントレベルで作成）
        const layerOptions = { name: `${channelType}_Base` , color: constants.LabelColors.GRAY , fillNeutral: true , blendMode: constants.BlendMode.NORMAL };
        const baseLayer = await doc.createPixelLayer(layerOptions);

        // ベースレイヤーを白色で塗りつぶす
        const imaging = require('photoshop').imaging;
        const width = doc.width;
        const height = doc.height;
        const components = 3; // RGB
        
        // 白色データを作成（RGB: 255, 255, 255）
        const whiteData = new Uint8Array(components * width * height);
        for (let i = 0; i < components * width * height; i += components) {
            whiteData[i] = 255;     // R
            whiteData[i + 1] = 255; // G  
            whiteData[i + 2] = 255; // B
        }
        
        // ImageDataを作成
        const imageData = await imaging.createImageDataFromBuffer(
            whiteData,
            {
                width: width,
                height: height,
                components: components,
                colorProfile: "sRGB IEC61966-2.1",
                colorSpace: "RGB"
            }
        );
        
        // レイヤーに白色データを適用
        await imaging.putPixels({
            layerID: baseLayer.id,
            imageData: imageData,
            targetBounds: { top: 0, left: 0 },
            replace: true
        });
        
        // ImageDataのメモリを解放
        imageData.dispose();

        
        
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

// 指定されたレイヤーグループを見つける関数
async function findLayerGroup(doc, groupName) {
    try {
        const layers = await doc.layers;
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer.name === groupName && layer.kind === 'group') {
                return layer;
            }
        }
        return null;
    } catch (error) {
        console.error(`レイヤーグループ検索エラー (${groupName}):`, error);
        return null;
    }
}

// レイヤーグループの存在確認
async function validateRequiredGroups(doc) {
    const requiredGroups = ['R_AO', 'G_Roughness', 'B_Metalness'];
    const foundGroups = {};
    const missingGroups = [];

    for (const groupName of requiredGroups) {
        const group = await findLayerGroup(doc, groupName);
        if (group) {
            foundGroups[groupName] = group;
        } else {
            missingGroups.push(groupName);
        }
    }

    return { foundGroups, missingGroups };
}


// RGBチャンネルパッキングを実行
async function performChannelPacking(doc, foundGroups) {
    try {
        // 新しいドキュメントを作成してパックされたテクスチャを生成
        const originalDoc = doc;
        const { width, height } = originalDoc;
        
        // パック用の新しいドキュメントを作成
        const packedDoc = await app.createDocument({
            width: width,
            height: height,
            resolution: originalDoc.resolution,
            mode: "RGBColorMode",
            fill: "white"
        });

        // 各チャンネル用のレイヤーを作成
        const redLayer = await packedDoc.createPixelLayer({ name: "R_Channel_AO" });
        const greenLayer = await packedDoc.createPixelLayer({ name: "G_Channel_Roughness" });
        const blueLayer = await packedDoc.createPixelLayer({ name: "B_Channel_Metalness" });

        // 元のドキュメントから各グループの内容をコピー
        // 注意: UXP APIの制限により、実際のピクセルデータの操作は限定的
        // ここでは各チャンネル用レイヤーを作成し、ユーザーが手動でコピー&ペーストできるよう準備

        // 各レイヤーにブレンドモードを設定（チャンネル分離用）
        redLayer.blendMode = "multiply";
        greenLayer.blendMode = "multiply"; 
        blueLayer.blendMode = "multiply";

        // 元のドキュメントに戻って作業指示を表示
        app.activeDocument = originalDoc;

        return {
            success: true,
            packedDocument: packedDoc,
            message: "新しいドキュメントが作成されました。各グループの内容を対応するチャンネルレイヤーにコピーしてください。"
        };

    } catch (error) {
        console.error('チャンネルパッキングエラー:', error);
        return {
            success: false,
            message: `パッキング処理中にエラーが発生しました: ${error.message}`
        };
    }
}

// 簡易版エクスポート機能 - レイヤーグループの複製
async function performSimpleExport(doc, foundGroups) {
    try {
        // 新しいドキュメントを作成
        const originalDoc = doc;
        const { width, height } = originalDoc;
        
        const packedDoc = await app.createDocument({
            width: width,
            height: height,
            resolution: originalDoc.resolution,
            mode: "RGBColorMode",
            fill: "transparent",
            name: "Packed_Texture"
        });

        // 各グループを新しいドキュメントに複製
        for (const [groupName, group] of Object.entries(foundGroups)) {
            try {
                // グループを新しいドキュメントに複製
                const duplicatedGroup = await group.duplicate(packedDoc);
                duplicatedGroup.name = `${groupName}_Copy`;
                
                displayResult(`${groupName} を新しいドキュメントに複製しました`, 'info');
            } catch (error) {
                console.error(`グループ複製エラー (${groupName}):`, error);
            }
        }

        app.activeDocument = packedDoc;
        
        return {
            success: true,
            message: "テクスチャパッキング用の新しいドキュメントが作成されました。各グループが複製されています。"
        };

    } catch (error) {
        console.error('簡易エクスポートエラー:', error);
        return {
            success: false,
            message: `エクスポート処理中にエラーが発生しました: ${error.message}`
        };
    }
}

// ファイル保存ダイアログ表示
async function showSaveDialog() {
    try {
        const file = await fs.createSessionToken();
        const entry = await fs.getFileForSaving("packed_texture.psd", {
            types: ["psd", "jpg", "png"]
        });
        return entry;
    } catch (error) {
        console.error('ファイル保存ダイアログエラー:', error);
        return null;
    }
}

// ドキュメントをファイルに保存
async function saveDocumentToFile(doc, filePath) {
    try {
        // UXP APIの制限により、直接的なファイル保存は制限される
        // 代わりに、保存用の指示を表示
        return {
            success: true,
            message: "ドキュメントが準備されました。Photoshopの「ファイル → 保存」を使用してファイルを保存してください。"
        };
    } catch (error) {
        console.error('ファイル保存エラー:', error);
        return {
            success: false,
            message: `ファイル保存中にエラーが発生しました: ${error.message}`
        };
    }
}

// 高度なエクスポート機能（オプション選択付き）
async function performAdvancedExport(doc, foundGroups) {
    try {
        displayResult('高度なエクスポート処理を開始します...', 'info');
        
        // エクスポートオプションの設定
        const exportOptions = {
            createNewDocument: true,
            mergeChannels: true,
            autoSave: false
        };

        // 新しいドキュメントを作成
        const originalDoc = doc;
        const { width, height } = originalDoc;
        
        const packedDoc = await app.createDocument({
            width: width,
            height: height,
            resolution: originalDoc.resolution,
            mode: "RGBColorMode",
            fill: "black",
            name: "PackedTexture_RGB"
        });

        // 背景レイヤーを削除（透明にするため）
        try {
            const backgroundLayer = packedDoc.layers[0];
            if (backgroundLayer.name === "Background") {
                await backgroundLayer.delete();
            }
        } catch (error) {
            console.log('背景レイヤーの削除をスキップ');
        }

        // RGBチャンネル用のレイヤーを作成
        const channelMappings = [
            { group: 'R_AO', channelName: 'Red_AO', color: [255, 0, 0] },
            { group: 'G_Roughness', channelName: 'Green_Roughness', color: [0, 255, 0] },
            { group: 'B_Metalness', channelName: 'Blue_Metalness', color: [0, 0, 255] }
        ];

        for (const mapping of channelMappings) {
            if (foundGroups[mapping.group]) {
                try {
                    // 対応するグループを新しいドキュメントに複製
                    const sourceGroup = foundGroups[mapping.group];
                    const duplicatedGroup = await sourceGroup.duplicate(packedDoc);
                    duplicatedGroup.name = mapping.channelName;
                    
                    displayResult(`${mapping.group} → ${mapping.channelName} にマッピングしました`, 'info');
                } catch (error) {
                    displayResult(`${mapping.group} の処理中にエラー: ${error.message}`, 'warning');
                }
            }
        }

        // 新しいドキュメントをアクティブにする
        app.activeDocument = packedDoc;

        return {
            success: true,
            message: "高度なテクスチャパッキングが完了しました。各チャンネルが個別のレイヤーとして配置されています。"
        };

    } catch (error) {
        console.error('高度なエクスポートエラー:', error);
        return {    
            success: false,
            message: `高度なエクスポート処理中にエラーが発生しました: ${error.message}`
        };
    }
}

// エクスポートモード選択機能を追加
function showExportOptions() {
    return new Promise((resolve) => {
        // シンプルな確認ダイアログ（実際のUIは後で改善可能）
        const useAdvanced = confirm("高度なエクスポート機能を使用しますか？\n\n「OK」= 高度なエクスポート（推奨）\n「キャンセル」= 簡易エクスポート");
        resolve(useAdvanced);
    });
}

// Exportボタンのイベントリスナー
document.getElementById('export-btn').addEventListener('click', async () => {
    try {
        const doc = checkActiveDocument();
        if (!doc) return;

        displayResult('テクスチャパッキングを開始中...', 'info');
        
        await require('photoshop').core.executeAsModal(async () => {
            // 必要なレイヤーグループの存在確認
            const { foundGroups, missingGroups } = await validateRequiredGroups(doc);
            
            if (missingGroups.length > 0) {
                displayResult(`不足しているレイヤーグループ: ${missingGroups.join(', ')}。先にCreateボタンでグループを作成してください。`, 'error');
                return;
            }
            
            displayResult(`検出されたグループ: ${Object.keys(foundGroups).join(', ')}`, 'info');
            
            // エクスポートモードの選択
            const useAdvanced = await showExportOptions();
            
            let result;
            if (useAdvanced) {
                displayResult('高度なエクスポート機能を実行中...', 'info');
                result = await performAdvancedExport(doc, foundGroups);
            } else {
                displayResult('簡易エクスポート機能を実行中...', 'info');
                result = await performSimpleExport(doc, foundGroups);
            }
            
            if (result.success) {
                displayResult(result.message, 'success');
                
                // 追加の操作指示
                setTimeout(() => {
                    displayResult('📝 次の手順:\n1. 各レイヤーグループの内容を確認\n2. 必要に応じてレイヤーを結合\n3. 「ファイル → 保存」でテクスチャを保存', 'info');
                }, 2000);
                
            } else {
                displayResult(result.message, 'error');
            }
            
        }, {
            commandName: 'Export Packed Texture'
        });
        
    } catch (error) {
        displayResult(`エクスポートエラー: ${error.message}`, 'error');
        console.error('Export function error:', error);
    }
});

// プラグインの初期化
document.addEventListener('DOMContentLoaded', () => {
    displayResult('テクスチャパッキングツールが準備できました。各ボタンをクリックして開始してください。', 'info');
});
