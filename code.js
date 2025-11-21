// レイヤー命名君 (Layer Naming Assistant)
// Figma Plugin for intelligent layer naming

// プラグイン初期化
figma.showUI(__html__, {
  width: 400,
  height: 600,
  title: "レイヤー命名君"
});

// 設定のデフォルト値
const DEFAULT_SETTINGS = {
  language: 'japanese',
  useTextContent: true,
  includeLayerType: true,
  considerSize: false,
  japaneseSupport: true,
  designSystemMode: false,
  namingConvention: 'default',
  uiMode: 'beginner',
  aiIconRecognition: false, // 近日公開予定（一時無効化）
  smarthrMode: true, // SmartHR命名規則モード（デフォルト有効）
  ignoreComponents: true // コンポーネント・インスタンスを無視（デフォルト有効）
};

// 命名規則の定義
const NAMING_CONVENTIONS = {
  default: {
    separator: '_',
    format: '{prefix}_{content}_{suffix}'
  },
  ajike: {
    separator: '_',
    format: '{object}_{part}_{status}'
  },
  material: {
    separator: '-',
    format: 'md-{component}-{size}-{emphasis}-{state}'
  },
  apple: {
    separator: '-',
    format: 'ios-{component}-{style}-{state}'
  },
  fluent: {
    separator: '-',
    format: 'fluent-{component}-{density}-{state}'
  },
  carbon: {
    separator: '-',
    format: 'carbon-{component}-{size}-{state}'
  },
  antd: {
    separator: '-',
    format: 'ant-{component}-{size}-{type}-{state}'
  },
  lightning: {
    separator: '-',
    format: 'slds-{component}-{size}-{state}'
  },
  bootstrap: {
    separator: '-',
    format: 'bs-{component}-{size}-{variant}-{state}'
  },
  tailwind: {
    separator: '-',
    format: 'tw-{component}-{size}-{state}'
  },
  react_fontawesome: {
    separator: '/',
    format: '{ComponentName}/{variation}/{state}',
    caseStyle: 'pascal' // パスカルケース対応フラグ
  }
};

// UI言語設定
const UI_TEXTS = {
  japanese: {
    // メッセージ
    renaming: 'レイヤー名を更新中...',
    completed: '完了しました！',
    error: 'エラーが発生しました',
    noSelection: 'レイヤーが選択されていません',
    processing: '処理中...',
    
    // セクションタイトル
    quickPresets: 'ワンクリックでリネーム',
    contentSettings: 'コンテンツ設定',
    designSystemSettings: 'デザインシステム統合',
    
    // プリセット
    contentBasedText: '内容ベース',
    contentBasedDesc: 'text_ボタン, text_ログイン',
    functionBasedText: '機能ベース',
    functionBasedDesc: 'btn_primary, card_medium',
    japaneseSiteText: '日本語サイト',
    japaneseSiteDesc: '日本語UI・Webサイト向け',
    quickOrganizeText: 'とりあえず整理',
    quickOrganizeDesc: '迷ったらコレ！標準設定',
    
    // フォームラベル
    interfaceLanguage: 'インターフェース言語',
    useTextContent: 'テキスト内容を名前に含める',
    includeLayerType: 'レイヤータイプを含める',
    considerSize: 'サイズ情報を考慮する',
    japaneseSupport: '日本語文字サポート',
    designSystemMode: 'デザインシステムモードを有効化',
    namingConvention: '命名規則',
    aiIconRecognition: 'AIアイコン内容識別を有効化',
    ignoreComponents: 'コンポーネント・インスタンスを無視',
    
    // ボタン
    renameSelected: '選択したレイヤーをリネーム',
    renamePage: 'ページ全体をリネーム',
    
    // AI関連
    aiIconRecognitionTitle: 'AI アイコン認識',
    testAIFunction: 'AI機能をテスト',
    upgradePlan: 'プランをアップグレード',
    usageStatus: '使用状況',
    currentPlan: 'プラン',
    remainingCount: '残り回数',
    
    // その他
    layerInfoGetting: 'レイヤー情報を取得中...',
    
    // 新システム用
    mechanicalNaming: '機械的レイヤー命名',
    mechanicalDesc: 'デザイナー推奨の命名規則に基づいて、一貫性のあるレイヤー名を自動生成します。',
    componentRule: 'コンポーネント:',
    componentRuleDesc: 'そのまま（PrimaryButton、Heading）',
    multipleRule: '複数レイヤー:',
    multipleRuleDesc: '名前 + 連番（Item 1、Item 2）',
    basicRule: '基本要素:',
    basicRuleDesc: 'text、base、border、mask、label、header、footer、group'
  },
  english: {
    // メッセージ
    renaming: 'Renaming layers...',
    completed: 'Completed!',
    error: 'An error occurred',
    noSelection: 'No layers selected',
    processing: 'Processing...',
    
    // セクションタイトル
    quickPresets: 'One-Click Rename',
    contentSettings: 'Content Settings',
    designSystemSettings: 'Design System Integration',
    
    // プリセット
    contentBasedText: 'Content Based',
    contentBasedDesc: 'text_button, text_login',
    functionBasedText: 'Function Based',
    functionBasedDesc: 'btn_primary, card_medium',
    japaneseSiteText: 'Japanese Site',
    japaneseSiteDesc: 'For Japanese UI & websites',
    quickOrganizeText: 'Quick Organize',
    quickOrganizeDesc: 'When in doubt, use this!',
    
    // フォームラベル
    interfaceLanguage: 'Interface Language',
    useTextContent: 'Include text content in layer names',
    includeLayerType: 'Include layer type prefixes',
    considerSize: 'Consider size information',
    japaneseSupport: 'Japanese character support',
    designSystemMode: 'Enable design system mode',
    namingConvention: 'Naming Convention',
    aiIconRecognition: 'Enable AI icon content identification',
    ignoreComponents: 'Ignore Components & Instances',
    
    // ボタン
    renameSelected: 'Rename Selected Layers',
    renamePage: 'Rename Entire Page',
    
    // AI関連
    aiIconRecognitionTitle: 'AI Icon Recognition',
    testAIFunction: 'Test AI Function',
    upgradePlan: 'Upgrade Plan',
    usageStatus: 'Usage',
    currentPlan: 'Plan',
    remainingCount: 'Remaining',
    
    // その他
    layerInfoGetting: 'Getting layer information...',
    
    // 新システム用
    mechanicalNaming: 'Mechanical Layer Naming',
    mechanicalDesc: 'Automatically generates consistent layer names based on designer-recommended naming conventions.',
    componentRule: 'Components:',
    componentRuleDesc: 'Keep as-is (PrimaryButton, Heading)',
    multipleRule: 'Multiple Layers:',
    multipleRuleDesc: 'Name + Number (Item 1, Item 2)',
    basicRule: 'Basic Elements:',
    basicRuleDesc: 'text, base, border, mask, label, header, footer, group'
  },
  chinese: {
    // メッセージ
    renaming: '正在重命名图层...',
    completed: '完成！',
    error: '发生错误',
    noSelection: '未选择图层',
    processing: '处理中...',
    
    // セクションタイトル
    quickPresets: '一键重命名',
    contentSettings: '内容设置',
    designSystemSettings: '设计系统集成',
    
    // プリセット
    contentBasedText: '内容优先',
    contentBasedDesc: 'text_按钮, text_登录',
    functionBasedText: '功能优先',
    functionBasedDesc: 'btn_primary, card_medium',
    japaneseSiteText: '日语网站',
    japaneseSiteDesc: '适用于日语UI和网站',
    quickOrganizeText: '快速整理',
    quickOrganizeDesc: '不知道选什么就用这个！',
    
    // フォームラベル
    interfaceLanguage: '界面语言',
    useTextContent: '在图层名称中包含文本内容',
    includeLayerType: '包含图层类型前缀',
    considerSize: '考虑尺寸信息',
    japaneseSupport: '日语字符支持',
    designSystemMode: '启用设计系统模式',
    namingConvention: '命名约定',
    aiIconRecognition: '启用AI图标内容识别',
    ignoreComponents: '忽略组件和实例',
    
    // ボタン
    renameSelected: '重命名选定图层',
    renamePage: '重命名整个页面',
    
    // AI关联
    aiIconRecognitionTitle: 'AI 图标识别',
    testAIFunction: '测试AI功能',
    upgradePlan: '升级套餐',
    usageStatus: '使用情况',
    currentPlan: '套餐',
    remainingCount: '剩余次数',
    
    // その他
    layerInfoGetting: '正在获取图层信息...',
    
    // 新システム用
    mechanicalNaming: '机械化图层命名',
    mechanicalDesc: '基于设计师推荐的命名规则，自动生成一致的图层名称。',
    componentRule: '组件:',
    componentRuleDesc: '保持原样（PrimaryButton、Heading）',
    multipleRule: '多个图层:',
    multipleRuleDesc: '名称 + 编号（Item 1、Item 2）',
    basicRule: '基本元素:',
    basicRuleDesc: 'Icon、text、border、base、hover、shape、mask、group'
  }
};

// メッセージハンドラー
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'rename-layers':
        await handleRenameRequest(msg.settings, msg.scope);
        break;
      
      case 'get-layer-info':
        await sendLayerInfo();
        break;
      
      case 'save-settings':
        await figma.clientStorage.setAsync('layer-namer-settings', msg.settings);
        break;
      
      case 'load-settings':
        const settings = await figma.clientStorage.getAsync('layer-namer-settings') || DEFAULT_SETTINGS;
        figma.ui.postMessage({ type: 'settings-loaded', settings });
        break;
      
      case 'get-ui-texts':
        const language = msg.language || 'japanese';
        const uiTexts = UI_TEXTS[language] || UI_TEXTS.japanese;
        figma.ui.postMessage({ type: 'ui-texts-loaded', uiTexts });
        break;
      
      case 'get-ai-usage':
        await handleGetAIUsage();
        break;
      
      case 'increment-ai-usage':
        await handleIncrementAIUsage();
        break;
      
      case 'reset-ai-usage':
        await handleResetAIUsage();
        break;
      
      case 'upgrade-plan':
        await handleUpgradePlan(msg.plan);
        break;
      
      case 'ai-analyze-result':
        handleAIAnalysisResult(msg);
        break;
      
      case 'save-ai-usage':
        await handleSaveAIUsage(msg.usageData);
        break;
      
      case 'close-plugin':
        figma.closePlugin();
        break;
      
      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    figma.ui.postMessage({
      type: 'error',
      message: error.message
    });
  }
};

// レイヤー情報を送信
async function sendLayerInfo() {
  const selection = figma.currentPage.selection;
  const layerInfo = {
    selectedCount: selection.length,
    totalLayers: countAllLayers(figma.currentPage),
    hasSelection: selection.length > 0
  };
  
  figma.ui.postMessage({
    type: 'layer-info',
    data: layerInfo
  });
}

// 全レイヤー数をカウント
function countAllLayers(node) {
  let count = 1;
  if ('children' in node) {
    for (const child of node.children) {
      count += countAllLayers(child);
    }
  }
  return count;
}

// リネーム処理のメインハンドラー
async function handleRenameRequest(settings, scope) {
  const texts = UI_TEXTS[settings.language] || UI_TEXTS.japanese;
  
  figma.ui.postMessage({
    type: 'status-update',
    message: texts.processing
  });

  try {
    let nodesToRename = [];
    
    if (scope === 'selected') {
      nodesToRename = figma.currentPage.selection;
      if (nodesToRename.length === 0) {
        throw new Error(texts.noSelection);
      }
    } else if (scope === 'page') {
      nodesToRename = getAllNodes(figma.currentPage, { 
        skipComponents: settings.ignoreComponents 
      });
    }

    let processed = 0;
    const total = nodesToRename.length;

    // 新しいシステム：まず全体の名前を生成してから連番処理
    const newNames = [];
    for (const node of nodesToRename) {
      const newName = await generateNodeName(node, settings);
      newNames.push(newName);
    }
    
    // 連番処理を適用
    const finalNames = applySequentialNumbering(nodesToRename, newNames);
    
    // 実際に名前を変更（SmartHR汎用名置換対応）
    for (let i = 0; i < nodesToRename.length; i++) {
      const node = nodesToRename[i];
      const finalName = finalNames[i];
      
      if (finalName) {
        // SmartHR: 汎用名の置換判定（常時有効）
        const nodeInfo = await analyzeNode(node, settings);
        const shouldReplace = shouldReplaceGenericName(node.name, nodeInfo.layerType);
        
        // 名前が異なるか、汎用名を置換すべき場合は変更
        if (finalName !== node.name || shouldReplace) {
          node.name = finalName;
        }
      }
      
      processed++;
      
      // 進捗更新
      figma.ui.postMessage({
        type: 'progress-update',
        progress: (processed / total) * 100,
        current: processed,
        total: total
      });
    }

    figma.ui.postMessage({
      type: 'rename-complete',
      message: texts.completed,
      processed: processed
    });

  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: `${texts.error}: ${error.message}`
    });
  }
}

// 全ノードを取得
function getAllNodes(node, options = { skipComponents: false }) {
  const nodes = [];
  
  function traverse(current) {
    // スキップ判定
    if (options.skipComponents) {
      if (current.type === 'COMPONENT' || current.type === 'COMPONENT_SET' || current.type === 'INSTANCE') {
        return; // コンポーネント系は追加せず、中身も探索しない
      }
    }

    if (current.type !== 'PAGE') {
      nodes.push(current);
    }
    
    if ('children' in current) {
      for (const child of current.children) {
        traverse(child);
      }
    }
  }
  
  traverse(node);
  return nodes;
}

// ノードをリネーム
async function renameNode(node, settings) {
  try {
    const newName = await generateNodeName(node, settings);
    if (newName && newName !== node.name) {
      node.name = newName;
    }
  } catch (error) {
    console.warn(`Failed to rename node ${node.name}:`, error);
  }
}

// ノード名を生成
async function generateNodeName(node, settings) {
  const convention = NAMING_CONVENTIONS[settings.namingConvention] || NAMING_CONVENTIONS.default;
  
  // 基本情報を収集
  const nodeInfo = await analyzeNode(node, settings);
  
  // 新しいシンプルな命名システム
  return await generateLayerName(nodeInfo, settings);
}

// ノードを解析（新しいシンプルシステム）
async function analyzeNode(node, settings) {
  const layerType = detectLayerType(node);
  
  const info = {
    type: node.type.toLowerCase(),
    layerType: layerType,
    content: extractTextContent(node, settings),
    size: getNodeSize(node),
    position: getNodePosition(node),
    hasChildren: 'children' in node && node.children.length > 0,
    isVisible: node.visible,
    node: node // 元のノード情報を保持
  };
  
  return info;
}

// AI を使用してアイコンを分析
async function analyzeIconWithAI(node, settings) {
  try {
    // 使用量制限チェック
    const usageCheck = await checkAIUsageLimit();
    if (!usageCheck.allowed) {
      throw new Error(usageCheck.message);
    }
    
    // アイコンをPNG形式でエクスポート（高解像度）
    const imageBytes = await node.exportAsync({
      format: 'PNG',
      constraint: { type: 'SCALE', value: 2 }, // 2倍解像度でより正確な分析
      contentsOnly: true // 背景を除外
    });
    
    // UIにAI分析を依頼（同期的な通信方式に変更）
    figma.ui.postMessage({
      type: 'ai-analyze-icon',
      imageBytes: Array.from(imageBytes), // Uint8Array を Array に変換
      nodeId: node.id,
      nodeName: node.name
    });
    
    // 分析結果はグローバル変数で受け取る（ハンドラー競合を回避）
    return await waitForAIAnalysisResult(node.id);
    
  } catch (error) {
    console.error('アイコンのAI分析中にエラーが発生しました:', error);
    return null;
  }
}

// AI分析結果を格納するグローバル変数
let pendingAIAnalyses = new Map();

// AI分析結果を待機する関数
async function waitForAIAnalysisResult(nodeId, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      pendingAIAnalyses.delete(nodeId);
      reject(new Error('AI分析がタイムアウトしました'));
    }, timeout);
    
    pendingAIAnalyses.set(nodeId, { resolve, reject, timeoutId });
  });
}

// AI分析結果を処理する関数
function handleAIAnalysisResult(msg) {
  const { nodeId, success, iconName, error } = msg;
  const pending = pendingAIAnalyses.get(nodeId);
  
  if (!pending) {
    console.warn(`AI分析結果が返されましたが、対応する待機中の分析が見つかりません: ${nodeId}`);
    return;
  }
  
  // タイムアウトをクリア
  clearTimeout(pending.timeoutId);
  pendingAIAnalyses.delete(nodeId);
  
  if (success && iconName) {
    // AI分析成功時に使用量を増加
    handleIncrementAIUsage();
    pending.resolve(iconName);
  } else {
    pending.reject(new Error(error || 'AI分析に失敗しました'));
  }
}

// UI側からのAI使用量保存要求を処理
async function handleSaveAIUsage(usageData) {
  try {
    // Figma clientStorageに保存（統一）
    await figma.clientStorage.setAsync('ai-usage-tracking', usageData);
    console.log('AI使用量データが保存されました:', usageData);
  } catch (error) {
    console.error('AI使用量データの保存に失敗しました:', error);
  }
}

// テキストコンテンツを抽出
function extractTextContent(node, settings) {
  if (node.type === 'TEXT') {
    return cleanText(node.characters, settings);
  }
  
  if ('children' in node) {
    for (const child of node.children) {
      const text = extractTextContent(child, settings);
      if (text) {
        return text;
      }
    }
  }
  
  return null;
}

// テキストをクリーンアップ
function cleanText(text, settings) {
  if (!text) return null;
  
  // 基本的なクリーンアップ
  let cleaned = text.trim();
  
  // 日本語サポートが有効な場合の処理
  if (settings.japaneseSupport) {
    // 日本語文字を保持しつつ、記号を処理
    cleaned = cleaned.replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
  } else {
    // 英数字のみ
    cleaned = cleaned.replace(/[^\w\s]/g, '');
  }
  
  // スペースをアンダースコアに変換
  cleaned = cleaned.replace(/\s+/g, '_');
  
  // 長すぎる場合は切り詰め
  if (cleaned.length > 30) {
    cleaned = cleaned.substring(0, 30);
  }
  
  return cleaned || null;
}

// ノードサイズを取得
function getNodeSize(node) {
  return {
    width: node.width || 0,
    height: node.height || 0,
    area: (node.width || 0) * (node.height || 0)
  };
}

// ボタン検出の専門関数（多角的アプローチ）
function detectButton(node, size, ratio) {
  // スコアベースの判定システム
  let buttonScore = 0;
  
  // 1. サイズベース判定（緩和された条件）
  if (size.width > 30 && size.height > 15) { // 最小サイズを緩和
    if (size.width < 800 && size.height < 200) { // 最大サイズを拡張
      buttonScore += 20;
      
      // 理想的なボタンサイズ範囲
      if (size.width >= 80 && size.width <= 300 && size.height >= 30 && size.height <= 60) {
        buttonScore += 30;
      }
      
      // アスペクト比判定（より柔軟に）
      if (ratio >= 1.2 && ratio <= 8) { // 横長ボタン
        buttonScore += 25;
      } else if (ratio >= 0.7 && ratio <= 1.3) { // 正方形ボタン
        buttonScore += 15;
      }
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const buttonKeywords = [
      // 日本語
      'ボタン', 'ぼたん', 'クリック', 'くりっく', '送信', '決定', '確認', '実行',
      'ログイン', 'サインイン', '登録', '購入', '追加', '削除', '編集', '保存',
      '戻る', '次へ', '前へ', '完了', '開始', '終了', 'もっと見る', '詳細',
      // 英語  
      'button', 'click', 'submit', 'send', 'login', 'signin', 'signup', 'register',
      'buy', 'purchase', 'add', 'delete', 'edit', 'save', 'back', 'next', 'prev',
      'start', 'finish', 'complete', 'more', 'view', 'show', 'hide', 'open', 'close',
      'ok', 'cancel', 'yes', 'no', 'apply', 'reset', 'clear', 'search', 'go'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = buttonKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      buttonScore += matchCount * 25; // キーワード1つにつき25点
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 角丸の存在
    if (node.cornerRadius > 0) {
      buttonScore += 15;
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        buttonScore += 10;
      }
    }
    
    // エフェクト（シャドウ等）の存在
    if (node.effects && node.effects.length > 0) {
      const hasVisibleEffect = node.effects.some(effect => effect.visible !== false);
      if (hasVisibleEffect) {
        buttonScore += 10;
      }
    }
    
    // ストローク（境界線）の存在
    if (node.strokes && node.strokes.length > 0) {
      const hasVisibleStroke = node.strokes.some(stroke => stroke.visible !== false);
      if (hasVisibleStroke) {
        buttonScore += 8;
      }
    }
  }
  
  // 4. 構造的判定（子要素の構成）
  if ('children' in node && node.children) {
    const textCount = node.children.filter(child => child.type === 'TEXT').length;
    const iconCount = node.children.filter(child => 
      child.type === 'FRAME' && child.width < 50 && child.height < 50
    ).length;
    
    // テキスト + アイコンの組み合わせ
    if (textCount === 1 && iconCount === 1) {
      buttonScore += 20;
    } else if (textCount === 1 && iconCount === 0) {
      buttonScore += 15; // テキストのみ
    } else if (textCount === 0 && iconCount === 1) {
      buttonScore += 10; // アイコンのみ
    }
    
    // 子要素が少ない（ボタンらしい単純構造）
    if (node.children.length <= 3) {
      buttonScore += 5;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['button', 'btn', 'ボタン', 'click', 'submit'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      buttonScore += 30;
    }
  }
  
  // スコア判定とボタンタイプの決定
  if (buttonScore >= 60) {
    // 正方形に近い場合はicon-button
    if (Math.abs(ratio - 1) < 0.4 && size.width < 100 && size.height < 100) {
      return 'icon-button';
    }
    return 'button';
  } else if (buttonScore >= 40) {
    // 中程度の確信度の場合
    return 'button-candidate'; // 候補として扱う
  }
  
  return null; // ボタンではない
}

// Input Field検出の専門関数（多角的アプローチ）
function detectInput(node, size, ratio) {
  let inputScore = 0;
  
  // 1. サイズベース判定（緩和された条件）
  if (size.width > 60 && size.height > 20) { // 最小サイズを緩和
    if (size.width < 800 && size.height < 120) { // 最大サイズを拡張
      inputScore += 15;
      
      // 理想的なインプットフィールドサイズ範囲
      if (size.width >= 120 && size.width <= 400 && size.height >= 30 && size.height <= 50) {
        inputScore += 25;
      }
      
      // アスペクト比判定（横長が基本）
      if (ratio >= 2 && ratio <= 12) { // 横長インプット
        inputScore += 30;
      }
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const inputKeywords = [
      // 日本語
      '入力', 'にゅうりょく', 'テキスト', 'てきすと', '検索', 'けんさく',
      'メール', 'めーる', 'パスワード', 'ぱすわーど', '名前', 'なまえ',
      'お名前', 'おなまえ', '住所', 'じゅうしょ', '電話', 'でんわ',
      // 英語  
      'input', 'text', 'search', 'email', 'password', 'name', 'username',
      'address', 'phone', 'number', 'field', 'enter', 'type', 'write',
      'placeholder', 'hint'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = inputKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      inputScore += matchCount * 20; // キーワード1つにつき20点
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 境界線の存在（インプットフィールドの重要な特徴）
    if (node.strokes && node.strokes.length > 0) {
      const hasVisibleStroke = node.strokes.some(stroke => stroke.visible !== false);
      if (hasVisibleStroke) {
        inputScore += 20; // ストロークは重要
      }
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        inputScore += 10;
      }
    }
    
    // 角丸の存在（モダンなインプットフィールド）
    if (node.cornerRadius > 0 && node.cornerRadius < 20) {
      inputScore += 10;
    }
  }
  
  // 4. 構造的判定（子要素の構成）
  if ('children' in node && node.children) {
    const textCount = node.children.filter(child => child.type === 'TEXT').length;
    
    // プレースホルダーテキストの存在
    if (textCount === 1) {
      inputScore += 15;
    }
    
    // 単純な構造（インプットフィールドらしい）
    if (node.children.length <= 2) {
      inputScore += 10;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['input', 'field', 'text', 'search', '入力', 'テキスト'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      inputScore += 25;
    }
  }
  
  // スコア判定
  if (inputScore >= 60) {
    return 'input';
  } else if (inputScore >= 40) {
    return 'input-candidate';
  }
  
  return null;
}

// Card検出の専門関数（多角的アプローチ）
function detectCard(node, size, ratio) {
  let cardScore = 0;
  
  // 1. サイズベース判定
  if (size.area > 8000) { // 最小面積を緩和
    cardScore += 15;
    
    // 理想的なカードサイズ範囲
    if (size.width >= 150 && size.width <= 500 && size.height >= 100 && size.height <= 400) {
      cardScore += 25;
    }
    
    // アスペクト比判定（縦長〜正方形〜やや横長）
    if (ratio >= 0.5 && ratio <= 2.5) {
      cardScore += 20;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const cardKeywords = [
      // 日本語
      'カード', 'かーど', '詳細', 'しょうさい', '商品', 'しょうひん',
      '記事', 'きじ', '投稿', 'とうこう', 'プロフィール', 'ぷろふぃーる',
      // 英語  
      'card', 'item', 'product', 'article', 'post', 'profile', 'detail',
      'more', 'read', 'view', 'learn'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = cardKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      cardScore += matchCount * 15;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 角丸の存在（カードの重要な特徴）
    if (node.cornerRadius > 4) {
      cardScore += 20;
    }
    
    // シャドウエフェクト（カードの典型的特徴）
    if (node.effects && node.effects.length > 0) {
      const hasShadow = node.effects.some(effect => 
        effect.type === 'DROP_SHADOW' && effect.visible !== false
      );
      if (hasShadow) {
        cardScore += 25; // シャドウは重要
      }
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        cardScore += 10;
      }
    }
  }
  
  // 4. 構造的判定（カードらしい複合構造）
  if ('children' in node && node.children) {
    const textCount = node.children.filter(child => child.type === 'TEXT').length;
    const frameCount = node.children.filter(child => child.type === 'FRAME').length;
    
    // 複数のコンテンツ要素（テキスト+画像+ボタン等）
    if (textCount >= 2 && frameCount >= 1) {
      cardScore += 25;
    } else if (textCount >= 1 && frameCount >= 2) {
      cardScore += 20;
    }
    
    // 適度な複雑さ（カードらしい構造）
    if (node.children.length >= 3 && node.children.length <= 8) {
      cardScore += 15;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['card', 'item', 'product', 'カード', '商品', 'tile'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      cardScore += 20;
    }
  }
  
  // スコア判定
  if (cardScore >= 70) {
    return 'card';
  } else if (cardScore >= 50) {
    return 'card-candidate';
  }
  
  return null;
}

// Icon検出の専門関数（多角的アプローチ）
function detectIcon(node, size, ratio) {
  let iconScore = 0;
  
  // 1. サイズベース判定（アイコンサイズ範囲を拡張）
  if (size.width <= 96 && size.height <= 96 && size.width >= 12 && size.height >= 12) {
    iconScore += 20;
    
    // 理想的なアイコンサイズ
    if ([16, 20, 24, 32, 40, 48, 64].some(s => 
      Math.abs(size.width - s) <= 4 && Math.abs(size.height - s) <= 4
    )) {
      iconScore += 25;
    }
    
    // 正方形であることを重視
    if (Math.abs(ratio - 1) < 0.3) {
      iconScore += 30;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const iconKeywords = [
      // 日本語
      'アイコン', 'あいこん', 'ホーム', 'ほーむ', 'メニュー', 'めにゅー',
      'ハート', 'はーと', '星', 'ほし', '矢印', 'やじるし',
      // 英語・記号  
      'icon', 'home', 'menu', 'heart', 'star', 'arrow', 'search', 'user',
      'play', 'pause', 'stop', 'close', 'add', 'plus', 'minus', 'edit',
      '→', '←', '↑', '↓', '▶', '⏸', '■', '✕', '⚙', '🏠', '❤', '⭐'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = iconKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      iconScore += matchCount * 25;
    }
  }
  
  // 3. レイヤー名による判定（アイコンは名前が重要）
  if (node.name) {
    const nameKeywords = [
      'icon', 'アイコン', 'ico', 'symbol', 'mark', 'home', 'menu',
      'arrow', 'heart', 'star', 'user', 'search', 'play', 'close'
    ];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      iconScore += 30;
    }
  }
  
  // 4. 構造的判定（アイコンは単純構造）
  if ('children' in node && node.children) {
    // アイコンは子要素が少ない
    if (node.children.length <= 3) {
      iconScore += 15;
    }
    
    // 主にベクター要素で構成
    const vectorCount = node.children.filter(child => 
      child.type === 'VECTOR' || child.type === 'BOOLEAN_OPERATION'
    ).length;
    if (vectorCount > 0) {
      iconScore += 20;
    }
  }
  
  // 5. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 単色塗り（アイコンの典型的特徴）
    if (node.fills && node.fills.length === 1) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.visible !== false) {
        iconScore += 15;
      }
    }
  }
  
  // スコア判定とアイコンタイプの決定
  if (iconScore >= 70) {
    return {
      type: 'icon',
      isIconCandidate: true,
      size: size
    };
  } else if (iconScore >= 50) {
    return {
      type: 'icon-candidate',
      isIconCandidate: true,
      size: size
    };
  }
  
  return null;
}

// Navbar検出の専門関数（多角的アプローチ）
function detectNavbar(node, size, ratio) {
  let navbarScore = 0;
  
  // 1. サイズベース判定
  if (size.width > 150 && size.height > 30 && size.height < 150) {
    navbarScore += 15;
    
    // 理想的なナビゲーションバーサイズ範囲
    if (size.width >= 300 && ratio >= 3) {
      navbarScore += 25;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const navKeywords = [
      // 日本語
      'ナビ', 'なび', 'メニュー', 'めにゅー', 'ホーム', 'ほーむ',
      'ログイン', 'ろぐいん', 'サインイン', 'さいんいん',
      // 英語  
      'nav', 'menu', 'home', 'about', 'contact', 'login', 'signup',
      'products', 'services', 'blog', 'news'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = navKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      navbarScore += matchCount * 20;
    }
  }
  
  // 3. 構造的判定（複数のリンク要素）
  if ('children' in node && node.children) {
    const linkLikeCount = node.children.filter(child => 
      child.type === 'TEXT' || (child.type === 'FRAME' && child.children && child.children.some(c => c.type === 'TEXT'))
    ).length;
    
    // 複数のナビゲーションアイテム
    if (linkLikeCount >= 3) {
      navbarScore += 30;
    } else if (linkLikeCount >= 2) {
      navbarScore += 20;
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['nav', 'menu', 'navigation', 'header', 'ナビ', 'メニュー'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      navbarScore += 25;
    }
  }
  
  // スコア判定
  if (navbarScore >= 70) {
    return 'navbar';
  } else if (navbarScore >= 50) {
    return 'navbar-candidate';
  }
  
  return null;
}

// Badge検出の専門関数（多角的アプローチ）
function detectBadge(node, size, ratio) {
  let badgeScore = 0;
  
  // 1. サイズベース判定（小さいサイズ）
  if (size.width < 200 && size.height < 60) {
    badgeScore += 20;
    
    // 理想的なバッジサイズ範囲
    if (size.width >= 20 && size.width <= 120 && size.height >= 16 && size.height <= 40) {
      badgeScore += 25;
    }
    
    // アスペクト比判定（やや横長）
    if (ratio >= 1.2 && ratio <= 6) {
      badgeScore += 20;
    }
  }
  
  // 2. コンテンツベース判定（短いテキスト）
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const badgeKeywords = [
      // 日本語
      '新着', 'しんちゃく', '人気', 'にんき', '限定', 'げんてい',
      'セール', 'せーる', '割引', 'わりびき', '無料', 'むりょう',
      // 英語  
      'new', 'hot', 'sale', 'free', 'pro', 'beta', 'tag', 'label'
    ];
    
    // 短いテキスト（バッジの特徴）
    if (content.length <= 6) {
      badgeScore += 20;
    }
    
    const lowerContent = content.toLowerCase();
    const matchCount = badgeKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      badgeScore += matchCount * 25;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 高い角丸（バッジの典型的特徴）
    if (node.cornerRadius >= 8) {
      badgeScore += 25;
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        badgeScore += 15;
      }
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['badge', 'tag', 'label', 'chip', 'バッジ', 'タグ'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      badgeScore += 30;
    }
  }
  
  // スコア判定
  if (badgeScore >= 60) {
    return 'badge';
  } else if (badgeScore >= 40) {
    return 'badge-candidate';
  }
  
  return null;
}

// Modal検出の専門関数（多角的アプローチ）
function detectModal(node, size, ratio) {
  let modalScore = 0;
  
  // 1. サイズベース判定（大きめのサイズ）
  if (size.area > 40000) {
    modalScore += 20;
    
    // 理想的なモーダルサイズ範囲
    if (size.width >= 300 && size.width <= 800 && size.height >= 200 && size.height <= 600) {
      modalScore += 25;
    }
    
    // アスペクト比判定（正方形〜やや横長）
    if (ratio >= 0.7 && ratio <= 2.5) {
      modalScore += 20;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const modalKeywords = [
      // 日本語
      'モーダル', 'もーだる', 'ダイアログ', 'だいあろぐ', '確認', 'かくにん',
      '警告', 'けいこく', '通知', 'つうち', 'ポップアップ', 'ぽっぷあっぷ',
      // 英語  
      'modal', 'dialog', 'popup', 'alert', 'confirm', 'warning', 'notice'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = modalKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      modalScore += matchCount * 20;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 大きなシャドウエフェクト（モーダルの典型的特徴）
    if (node.effects && node.effects.length > 0) {
      const hasLargeShadow = node.effects.some(effect => 
        effect.type === 'DROP_SHADOW' && effect.visible !== false && effect.radius > 10
      );
      if (hasLargeShadow) {
        modalScore += 30;
      }
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        modalScore += 15;
      }
    }
    
    // 角丸の存在
    if (node.cornerRadius > 0) {
      modalScore += 10;
    }
  }
  
  // 4. 構造的判定（モーダルらしい構造）
  if ('children' in node && node.children) {
    // 適度な複雑さ（ヘッダー+ボディ+フッター構成）
    if (node.children.length >= 2 && node.children.length <= 6) {
      modalScore += 15;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['modal', 'dialog', 'popup', 'alert', 'モーダル', 'ダイアログ'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      modalScore += 25;
    }
  }
  
  // スコア判定
  if (modalScore >= 70) {
    return 'modal';
  } else if (modalScore >= 50) {
    return 'modal-candidate';
  }
  
  return null;
}

// ListItem検出の専門関数（多角的アプローチ）
function detectListItem(node, size, ratio) {
  let listItemScore = 0;
  
  // 1. サイズベース判定（横長）
  if (size.width > 150 && size.height > 30 && size.height < 150) {
    listItemScore += 15;
    
    // 理想的なリストアイテムサイズ範囲
    if (size.width >= 200 && ratio >= 2 && ratio <= 10) {
      listItemScore += 25;
    }
  }
  
  // 2. 構造的判定（リストアイテムらしい構造）
  if ('children' in node && node.children) {
    const textCount = node.children.filter(child => child.type === 'TEXT').length;
    const frameCount = node.children.filter(child => child.type === 'FRAME').length;
    
    // テキスト+アイコン/画像の組み合わせ
    if (textCount >= 1 && frameCount >= 1) {
      listItemScore += 25;
    }
    
    // 適度な複雑さ
    if (node.children.length >= 2 && node.children.length <= 5) {
      listItemScore += 15;
    }
  }
  
  // 3. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['list', 'item', 'row', 'entry', 'リスト', 'アイテム'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      listItemScore += 25;
    }
  }
  
  // スコア判定
  if (listItemScore >= 60) {
    return 'list-item';
  } else if (listItemScore >= 40) {
    return 'list-item-candidate';
  }
  
  return null;
}

// Sidebar検出の専門関数（多角的アプローチ）
function detectSidebar(node, size, ratio) {
  let sidebarScore = 0;
  
  // 1. サイズベース判定（縦長）
  if (size.height > 200 && ratio < 1) {
    sidebarScore += 20;
    
    // 理想的なサイドバーサイズ範囲
    if (size.width >= 150 && size.width <= 400 && size.height >= 300 && ratio <= 0.8) {
      sidebarScore += 30;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const sidebarKeywords = [
      // 日本語
      'サイドバー', 'さいどばー', 'メニュー', 'めにゅー', 'ナビ', 'なび',
      // 英語  
      'sidebar', 'side', 'menu', 'nav', 'navigation'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = sidebarKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      sidebarScore += matchCount * 20;
    }
  }
  
  // 3. 構造的判定（縦に並んだメニュー項目）
  if ('children' in node && node.children) {
    const linkLikeCount = node.children.filter(child => 
      child.type === 'TEXT' || (child.type === 'FRAME' && child.children && child.children.some(c => c.type === 'TEXT'))
    ).length;
    
    // 複数のメニューアイテム
    if (linkLikeCount >= 3) {
      sidebarScore += 25;
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['sidebar', 'side', 'menu', 'nav', 'サイドバー', 'メニュー'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      sidebarScore += 25;
    }
  }
  
  // スコア判定
  if (sidebarScore >= 70) {
    return 'sidebar';
  } else if (sidebarScore >= 50) {
    return 'sidebar-candidate';
  }
  
  return null;
}

// Header検出の専門関数（多角的アプローチ）
function detectHeader(node, size, ratio) {
  let headerScore = 0;
  
  // 1. サイズベース判定（横長、上部配置）
  if (size.width > 250 && size.height < 250) {
    headerScore += 15;
    
    // 理想的なヘッダーサイズ範囲
    if (size.width >= 400 && size.height >= 50 && size.height <= 150 && ratio >= 3) {
      headerScore += 25;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const headerKeywords = [
      // 日本語
      'ヘッダー', 'へっだー', 'タイトル', 'たいとる', 'ロゴ', 'ろご',
      // 英語  
      'header', 'title', 'logo', 'brand', 'site', 'top'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = headerKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      headerScore += matchCount * 20;
    }
  }
  
  // 3. 位置による判定（ページ上部）
  if (node.y !== undefined && node.y < 100) {
    headerScore += 25;
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['header', 'top', 'title', 'logo', 'ヘッダー', 'タイトル'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      headerScore += 25;
    }
  }
  
  // スコア判定
  if (headerScore >= 60) {
    return 'header';
  } else if (headerScore >= 40) {
    return 'header-candidate';
  }
  
  return null;
}

// Footer検出の専門関数（多角的アプローチ）
function detectFooter(node, size, ratio) {
  let footerScore = 0;
  
  // 1. サイズベース判定（横長、薄め）
  if (size.width > 250 && size.height < 200) {
    footerScore += 15;
    
    // 理想的なフッターサイズ範囲
    if (size.width >= 400 && size.height >= 40 && size.height <= 120 && ratio >= 4) {
      footerScore += 25;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const footerKeywords = [
      // 日本語
      'フッター', 'ふったー', 'コピーライト', 'こぴーらいと', '著作権', 'ちょさくけん',
      // 英語  
      'footer', 'copyright', '©', 'rights', 'reserved', 'terms', 'privacy'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = footerKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      footerScore += matchCount * 20;
    }
  }
  
  // 3. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['footer', 'bottom', 'copyright', 'フッター', 'コピーライト'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      footerScore += 25;
    }
  }
  
  // スコア判定
  if (footerScore >= 60) {
    return 'footer';
  } else if (footerScore >= 40) {
    return 'footer-candidate';
  }
  
  return null;
}

// Dropdown検出の専門関数（多角的アプローチ）
function detectDropdown(node, size, ratio) {
  let dropdownScore = 0;
  
  // 1. サイズベース判定（横長）
  if (size.width > 80 && size.height > 25 && size.height < 80) {
    dropdownScore += 20;
    
    // 理想的なドロップダウンサイズ範囲
    if (size.width >= 120 && size.width <= 400 && size.height >= 30 && size.height <= 60) {
      dropdownScore += 25;
    }
    
    // アスペクト比判定（横長）
    if (ratio >= 2 && ratio <= 10) {
      dropdownScore += 20;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const dropdownKeywords = [
      // 日本語
      '選択', 'せんたく', 'ドロップダウン', 'どろっぷだうん', '▼', '⬇',
      'プルダウン', 'ぷるだうん', '選択肢', 'せんたくし',
      // 英語・記号  
      'select', 'dropdown', 'choose', 'option', 'pick', 'pulldown',
      'combobox', 'picker', '▽', '⌄', '»'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = dropdownKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      dropdownScore += matchCount * 30;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 境界線の存在（ドロップダウンの重要な特徴）
    if (node.strokes && node.strokes.length > 0) {
      const hasVisibleStroke = node.strokes.some(stroke => stroke.visible !== false);
      if (hasVisibleStroke) {
        dropdownScore += 20;
      }
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        dropdownScore += 10;
      }
    }
  }
  
  // 4. 構造的判定（テキスト + 矢印アイコン）
  if ('children' in node && node.children) {
    const textCount = node.children.filter(child => child.type === 'TEXT').length;
    const vectorCount = node.children.filter(child => 
      child.type === 'VECTOR' || child.type === 'FRAME'
    ).length;
    
    // テキスト + アイコンの組み合わせ
    if (textCount >= 1 && vectorCount >= 1) {
      dropdownScore += 25;
    }
    
    // 単純な構造（ドロップダウンらしい）
    if (node.children.length >= 2 && node.children.length <= 4) {
      dropdownScore += 15;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['dropdown', 'select', 'picker', 'combo', 'ドロップダウン', '選択'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      dropdownScore += 25;
    }
  }
  
  // スコア判定
  if (dropdownScore >= 70) {
    return 'dropdown';
  } else if (dropdownScore >= 50) {
    return 'dropdown-candidate';
  }
  
  return null;
}

// Checkbox検出の専門関数（多角的アプローチ）
function detectCheckbox(node, size, ratio) {
  let checkboxScore = 0;
  
  // 1. サイズベース判定（小さい正方形）
  if (size.width <= 40 && size.height <= 40 && size.width >= 12 && size.height >= 12) {
    checkboxScore += 25;
    
    // 理想的なチェックボックスサイズ
    if (size.width >= 16 && size.width <= 32 && size.height >= 16 && size.height <= 32) {
      checkboxScore += 25;
    }
    
    // 正方形であることを重視
    if (Math.abs(ratio - 1) < 0.3) {
      checkboxScore += 30;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const checkboxKeywords = [
      // 日本語
      'チェック', 'ちぇっく', '選択', 'せんたく', '☑', '✓', '✔',
      'レ点', 'れてん', 'チェックボックス', 'ちぇっくぼっくす',
      // 英語・記号  
      'check', 'checkbox', 'tick', 'mark', 'select', 'option',
      '□', '☐', '☑', '☒'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = checkboxKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      checkboxScore += matchCount * 25;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 境界線の存在（チェックボックスの重要な特徴）
    if (node.strokes && node.strokes.length > 0) {
      const hasVisibleStroke = node.strokes.some(stroke => stroke.visible !== false);
      if (hasVisibleStroke) {
        checkboxScore += 20;
      }
    }
    
    // 角丸が少ない（正方形に近い）
    if (node.cornerRadius <= 4) {
      checkboxScore += 15;
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['checkbox', 'check', 'tick', 'チェック', 'チェックボックス'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      checkboxScore += 25;
    }
  }
  
  // スコア判定
  if (checkboxScore >= 70) {
    return 'checkbox';
  } else if (checkboxScore >= 50) {
    return 'checkbox-candidate';
  }
  
  return null;
}

// Radio Button検出の専門関数（多角的アプローチ）
function detectRadio(node, size, ratio) {
  let radioScore = 0;
  
  // 1. サイズベース判定（小さい円形）
  if (size.width <= 40 && size.height <= 40 && size.width >= 12 && size.height >= 12) {
    radioScore += 25;
    
    // 理想的なラジオボタンサイズ
    if (size.width >= 16 && size.width <= 32 && size.height >= 16 && size.height <= 32) {
      radioScore += 25;
    }
    
    // 正円であることを重視
    if (Math.abs(ratio - 1) < 0.2) {
      radioScore += 30;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const radioKeywords = [
      // 日本語
      'ラジオ', 'らじお', '選択', 'せんたく', '○', '●', '◯',
      'ラジオボタン', 'らじおぼたん', 'オプション', 'おぷしょん',
      // 英語・記号  
      'radio', 'option', 'choice', 'select', 'bullet',
      '•', '⚫', '⚪', '◉', '◯'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = radioKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      radioScore += matchCount * 25;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 高い角丸（円形の特徴）
    if (node.cornerRadius >= size.width / 2 - 2) {
      radioScore += 25;
    }
    
    // 境界線の存在
    if (node.strokes && node.strokes.length > 0) {
      const hasVisibleStroke = node.strokes.some(stroke => stroke.visible !== false);
      if (hasVisibleStroke) {
        radioScore += 20;
      }
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['radio', 'option', 'choice', 'ラジオ', 'オプション'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      radioScore += 25;
    }
  }
  
  // スコア判定
  if (radioScore >= 70) {
    return 'radio';
  } else if (radioScore >= 50) {
    return 'radio-candidate';
  }
  
  return null;
}

// Toggle/Switch検出の専門関数（多角的アプローチ）
function detectToggle(node, size, ratio) {
  let toggleScore = 0;
  
  // 1. サイズベース判定（横長楕円）
  if (size.width > 30 && size.width < 100 && size.height > 15 && size.height < 50) {
    toggleScore += 20;
    
    // 理想的なトグルサイズ範囲
    if (size.width >= 40 && size.width <= 80 && size.height >= 20 && size.height <= 40) {
      toggleScore += 25;
    }
    
    // アスペクト比判定（約2:1）
    if (ratio >= 1.8 && ratio <= 3) {
      toggleScore += 30;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const toggleKeywords = [
      // 日本語
      'トグル', 'とぐる', 'スイッチ', 'すいっち', '切替', 'きりかえ',
      'ON', 'OFF', 'オン', 'おん', 'オフ', 'おふ',
      // 英語  
      'toggle', 'switch', 'on', 'off', 'enable', 'disable'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = toggleKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      toggleScore += matchCount * 25;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 高い角丸（楕円形の特徴）
    if (node.cornerRadius >= size.height / 2 - 2) {
      toggleScore += 25;
    }
    
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        toggleScore += 15;
      }
    }
  }
  
  // 4. 構造的判定（楕円背景 + 内部の円）
  if ('children' in node && node.children) {
    const circleCount = node.children.filter(child => 
      child.type === 'ELLIPSE' || (child.type === 'FRAME' && Math.abs((child.width / child.height) - 1) < 0.2)
    ).length;
    
    // 内部に円形要素がある
    if (circleCount >= 1) {
      toggleScore += 25;
    }
    
    // 単純な構造
    if (node.children.length <= 3) {
      toggleScore += 10;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['toggle', 'switch', 'トグル', 'スイッチ'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      toggleScore += 25;
    }
  }
  
  // スコア判定
  if (toggleScore >= 70) {
    return 'toggle';
  } else if (toggleScore >= 50) {
    return 'toggle-candidate';
  }
  
  return null;
}

// Tabs検出の専門関数（多角的アプローチ）
function detectTabs(node, size, ratio) {
  let tabsScore = 0;
  
  // 1. サイズベース判定（横長）
  if (size.width > 150 && size.height > 25 && size.height < 100) {
    tabsScore += 15;
    
    // 理想的なタブサイズ範囲
    if (size.width >= 200 && ratio >= 3) {
      tabsScore += 20;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const tabsKeywords = [
      // 日本語
      'タブ', 'たぶ', '切替', 'きりかえ', 'タブメニュー', 'たぶめにゅー',
      // 英語  
      'tab', 'tabs', 'menu', 'navigation', 'switch'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = tabsKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      tabsScore += matchCount * 30;
    }
  }
  
  // 3. 構造的判定（複数の等幅要素が水平配置）
  if ('children' in node && node.children) {
    const childCount = node.children.length;
    
    // 複数のタブ要素（3個以上）
    if (childCount >= 3) {
      tabsScore += 40;
      
      // タブらしい数（3-8個）
      if (childCount <= 8) {
        tabsScore += 15;
      }
    } else if (childCount >= 2) {
      tabsScore += 25;
    }
    
    // 子要素のサイズが似ている（等幅タブ）
    if (childCount >= 2) {
      const widths = node.children.map(child => child.width || 0);
      const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
      const isEqualWidth = widths.every(w => Math.abs(w - avgWidth) < avgWidth * 0.3);
      
      if (isEqualWidth) {
        tabsScore += 20;
      }
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['tab', 'tabs', 'menu', 'navigation', 'タブ', 'メニュー'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      tabsScore += 25;
    }
  }
  
  // スコア判定
  if (tabsScore >= 70) {
    return 'tabs';
  } else if (tabsScore >= 50) {
    return 'tabs-candidate';
  }
  
  return null;
}

// Breadcrumb検出の専門関数（多角的アプローチ）
function detectBreadcrumb(node, size, ratio) {
  let breadcrumbScore = 0;
  
  // 1. サイズベース判定（横長）
  if (size.width > 150 && size.height > 15 && size.height < 60) {
    breadcrumbScore += 15;
    
    // 理想的なパンくずサイズ範囲
    if (size.width >= 200 && ratio >= 4) {
      breadcrumbScore += 20;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const breadcrumbKeywords = [
      // 日本語
      'パンくず', 'ぱんくず', 'ナビ', 'なび', '階層', 'かいそう',
      // 英語・記号  
      'breadcrumb', 'navigation', 'path', 'crumb', '>', '/', '→', '»', '›'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = breadcrumbKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      breadcrumbScore += matchCount * 30;
    }
    
    // 区切り文字の存在（重要な特徴）
    const separators = ['>', '/', '→', '»', '›', '•'];
    const hasSeparator = separators.some(sep => content.includes(sep));
    if (hasSeparator) {
      breadcrumbScore += 35;
    }
  }
  
  // 3. 構造的判定（複数のテキスト要素）
  if ('children' in node && node.children) {
    const textCount = node.children.filter(child => child.type === 'TEXT').length;
    
    // 複数のテキスト要素（パンくずらしい）
    if (textCount >= 2) {
      breadcrumbScore += 25;
      
      // 理想的な数（2-6個）
      if (textCount <= 6) {
        breadcrumbScore += 15;
      }
    }
    
    // 水平一列配置
    if (node.children.length >= 2) {
      breadcrumbScore += 10;
    }
  }
  
  // 4. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['breadcrumb', 'crumb', 'navigation', 'path', 'パンくず', 'ナビ'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      breadcrumbScore += 25;
    }
  }
  
  // スコア判定
  if (breadcrumbScore >= 70) {
    return 'breadcrumb';
  } else if (breadcrumbScore >= 50) {
    return 'breadcrumb-candidate';
  }
  
  return null;
}

// Progress Bar検出の専門関数（多角的アプローチ）
function detectProgressBar(node, size, ratio) {
  let progressScore = 0;
  
  // 1. サイズベース判定（非常に横長）
  if (size.width > 80 && size.height > 2 && size.height < 30) {
    progressScore += 20;
    
    // 理想的なプログレスバーサイズ範囲
    if (size.width >= 100 && size.height >= 4 && size.height <= 20) {
      progressScore += 25;
    }
    
    // アスペクト比判定（非常に横長）
    if (ratio >= 8) {
      progressScore += 40; // 最重要特徴
    } else if (ratio >= 5) {
      progressScore += 25;
    }
  }
  
  // 2. コンテンツベース判定
  const content = extractTextContent(node, { useTextContent: true, japaneseSupport: true });
  if (content) {
    const progressKeywords = [
      // 日本語
      'プログレス', 'ぷろぐれす', '進捗', 'しんちょく', '読み込み', 'よみこみ',
      'ローディング', 'ろーでぃんぐ', '%', 'パーセント', 'ぱーせんと',
      // 英語  
      'progress', 'loading', 'load', 'bar', 'percent', '%', 'complete',
      'completion', 'status'
    ];
    
    const lowerContent = content.toLowerCase();
    const matchCount = progressKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      progressScore += matchCount * 30;
    }
  }
  
  // 3. スタイル情報による判定
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // 背景色の存在
    if (node.fills && node.fills.length > 0) {
      const hasVisibleFill = node.fills.some(fill => fill.visible !== false && fill.opacity > 0);
      if (hasVisibleFill) {
        progressScore += 15;
      }
    }
    
    // 角丸の存在（モダンなプログレスバー）
    if (node.cornerRadius > 0) {
      progressScore += 10;
    }
  }
  
  // 4. 構造的判定（外枠 + 内部進捗バー）
  if ('children' in node && node.children) {
    // 内部に進捗を示す要素がある
    if (node.children.length >= 1 && node.children.length <= 3) {
      progressScore += 20;
    }
    
    // 子要素も横長である
    const hasHorizontalChild = node.children.some(child => 
      (child.width / child.height) >= 3
    );
    if (hasHorizontalChild) {
      progressScore += 15;
    }
  }
  
  // 5. レイヤー名による判定
  if (node.name) {
    const nameKeywords = ['progress', 'bar', 'loading', 'load', 'プログレス', '進捗'];
    const lowerName = node.name.toLowerCase();
    const nameMatch = nameKeywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );
    if (nameMatch) {
      progressScore += 25;
    }
  }
  
  // スコア判定
  if (progressScore >= 70) {
    return 'progress-bar';
  } else if (progressScore >= 50) {
    return 'progress-bar-candidate';
  }
  
  return null;
}

// レイヤータイプを検出（SmartHR命名規則対応）
function detectLayerType(node) {
  const nodeType = node.type;
  
  // 1. コンポーネント/インスタンスの判定
  if (isComponent(node)) {
    return 'component';
  }
  
  // 2. マスクの判定
  if (isMask(node)) {
    return 'mask';
  }
  
  // 3. アイコンの判定（小さいベクター要素）
  if (isIcon(node)) {
    return 'icon';
  }
  
  // 4. テキストの判定
  if (nodeType === 'TEXT') {
    return 'text';
  }
  
  // 5. シェイプの判定と用途分類
  if (isShape(node)) {
    return detectShapePurposeSmartHR(node);
  }
  
  // 6. グループの判定（SmartHR: より詳細な役割判定）
  if (isGroup(node)) {
    return detectGroupPurposeSmartHR(node);
  }
  
  // デフォルト
  return 'group';
}

// コンポーネント/インスタンスかどうかを判定
function isComponent(node) {
  return node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'INSTANCE';
}

// マスクかどうかを判定
function isMask(node) {
  // Figmaのマスク判定
  if (node.isMask) return true;
  
  // レイヤー名による判定
  if (node.name && node.name.toLowerCase().includes('mask')) return true;
  
  // クリッピング機能による判定
  if (node.clipsContent) return true;
  
  return false;
}

// アイコンかどうかを判定（シンプル版）
function isIcon(node) {
  const size = getNodeSize(node);
  
  // サイズによる判定（小さな正方形）
  if (size.width <= 96 && size.height <= 96 && size.width >= 12 && size.height >= 12) {
    const ratio = size.width / size.height;
    // 正方形に近い
    if (Math.abs(ratio - 1) < 0.5) {
      // ベクター要素または単純な構造
      if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION' || 
          (node.type === 'FRAME' && hasSimpleStructure(node))) {
        return true;
      }
      
      // レイヤー名による判定
      if (node.name && node.name.toLowerCase().includes('icon')) {
        return true;
      }
    }
  }
  
  return false;
}

// シェイプかどうかを判定
function isShape(node) {
  return ['RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'VECTOR', 'BOOLEAN_OPERATION', 'LINE'].includes(node.type);
}

// グループかどうかを判定
function isGroup(node) {
  return node.type === 'GROUP' || node.type === 'FRAME';
}

// シンプルな構造かどうかを判定
function hasSimpleStructure(node) {
  if (!('children' in node) || !node.children) return true;
  return node.children.length <= 3;
}

// シェイプの用途を判定
function detectShapePurpose(node) {
  const name = node.name ? node.name.toLowerCase() : '';
  
  // レイヤー名による判定
  if (name.includes('border') || name.includes('stroke') || name.includes('outline')) {
    return 'border';
  }
  
  if (name.includes('base') || name.includes('background') || name.includes('bg')) {
    return 'base';
  }
  
  if (name.includes('hover') || name.includes('active') || name.includes('focus')) {
    return 'hover';
  }
  
  // スタイル属性による判定
  if (hasOnlyStroke(node)) {
    return 'border';
  }
  
  if (hasLargeSize(node) && hasFill(node)) {
    return 'base';
  }
  
  // 透明度による判定（ホバー状態など）
  if (hasLowOpacity(node)) {
    return 'hover';
  }
  
  // デフォルト
  return 'shape';
}

// ストロークのみを持つかどうか
function hasOnlyStroke(node) {
  const hasStroke = node.strokes && node.strokes.length > 0 && 
                   node.strokes.some(stroke => stroke.visible !== false);
  const hasFillColor = node.fills && node.fills.length > 0 && 
                      node.fills.some(fill => fill.visible !== false && fill.opacity > 0.1);
  
  return hasStroke && !hasFillColor;
}

// フィルを持つかどうか
function hasFill(node) {
  return node.fills && node.fills.length > 0 && 
         node.fills.some(fill => fill.visible !== false && fill.opacity > 0.1);
}

// 大きなサイズかどうか
function hasLargeSize(node) {
  const size = getNodeSize(node);
  return size.area > 5000; // 適当な閾値
}

// 低い透明度かどうか
function hasLowOpacity(node) {
  return node.opacity < 0.8;
}

// SmartHR用: シェイプの用途を詳細判定
function detectShapePurposeSmartHR(node) {
  const name = node.name ? node.name.toLowerCase() : '';
  
  // 1. レイヤー名による明確な判定（優先度が高い）
  if (name.includes('border') || name.includes('stroke') || name.includes('outline') || name.includes('frame')) {
    return 'border';
  }
  
  if (name.includes('base') || name.includes('background') || name.includes('bg') || name.includes('backdrop')) {
    return 'base';
  }
  
  if (name.includes('hover') || name.includes('active') || name.includes('focus') || name.includes('pressed')) {
    return 'hover';
  }
  
  // 2. スタイル属性による詳細判定
  if (hasOnlyStroke(node)) {
    return 'border';
  }
  
  // 3. サイズと配置による判定
  if (hasLargeSize(node) && hasFill(node)) {
    // 大きくて塗りがある = 背景として使用される可能性が高い
    return 'base';
  }
  
  // 4. 透明度による判定（ホバー状態やオーバーレイなど）
  if (hasLowOpacity(node)) {
    return 'hover';
  }
  
  // 5. 線状の形状判定
  if (isLinearShape(node)) {
    return 'border';
  }
  
  // デフォルト: 汎用的なシェイプ
  return 'shape';
}

// SmartHR用: グループの用途を詳細判定（SmartHR完全準拠版）
function detectGroupPurposeSmartHR(node) {
  const name = node.name ? node.name.toLowerCase() : '';
  
  // 1. レイヤー名による明確な判定（SmartHR規則優先）
  if (name.includes('text') && hasTextChildren(node)) {
    return 'text';
  }
  
  if (name.includes('base') || name.includes('background')) {
    return 'base';
  }
  
  if (name.includes('border') || name.includes('outline')) {
    return 'border';
  }

  if (name.includes('label') || name.includes('ラベル')) {
    return 'label';
  }

  if (name.includes('header') || name.includes('ヘッダー')) {
    return 'header';
  }

  if (name.includes('footer') || name.includes('フッター')) {
    return 'footer';
  }

  if (name.includes('mask')) {
    return 'mask';
  }
  
  // 2. 詳細な構成分析による判定（SmartHR基本要素のみ）
  const mixedPurpose = detectMixedGroupPurpose(node);
  
  // SmartHR基本要素のみ採用
  if (['text', 'base', 'border', 'mask', 'label', 'header', 'footer'].includes(mixedPurpose)) {
    return mixedPurpose;
  }
  
  // 3. 旧来の判定方法（フォールバック）- SmartHR規則に限定
  if (hasTextChildren(node)) {
    return 'text';
  }
  
  // 4. シェイプのみのグループの分析（SmartHR要素のみ）
  if (containsOnlyShapes(node)) {
    const dominantPurpose = analyzeDominantShapePurpose(node);
    if (['base', 'border', 'mask'].includes(dominantPurpose)) {
      return dominantPurpose;
    }
  }
  
  // デフォルト: 役割不明な場合のみgroup
  return 'group';
}

// グループ内にアイコンらしい子要素があるか
function hasIconLikeChildren(node) {
  if (!node.children || node.children.length === 0) return false;
  
  // 小さなベクター要素が含まれているか
  return node.children.some(child => {
    const size = getNodeSize(child);
    return (child.type === 'VECTOR' || child.type === 'BOOLEAN_OPERATION') &&
           size.width <= 96 && size.height <= 96;
  });
}

// グループ内にテキスト要素があるか
function hasTextChildren(node) {
  if (!node.children || node.children.length === 0) return false;
  return node.children.some(child => child.type === 'TEXT');
}

// グループ内が形状のみで構成されているか
function containsOnlyShapes(node) {
  if (!node.children || node.children.length === 0) return false;
  
  return node.children.every(child => {
    return ['RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'VECTOR', 'BOOLEAN_OPERATION', 'LINE'].includes(child.type);
  });
}

// グループ内の支配的な形状の用途を分析
function analyzeDominantShapePurpose(node) {
  if (!node.children || node.children.length === 0) return 'shape';
  
  const purposes = node.children.map(child => detectShapePurposeSmartHR(child));
  
  // 最も多く出現する用途を返す
  const purposeCount = {};
  purposes.forEach(purpose => {
    purposeCount[purpose] = (purposeCount[purpose] || 0) + 1;
  });
  
  let maxCount = 0;
  let dominantPurpose = 'shape';
  
  for (const [purpose, count] of Object.entries(purposeCount)) {
    if (count > maxCount) {
      maxCount = count;
      dominantPurpose = purpose;
    }
  }
  
  return dominantPurpose;
}

// 線状の形状かどうか判定
function isLinearShape(node) {
  if (node.type === 'LINE') return true;
  
  const size = getNodeSize(node);
  const ratio = Math.max(size.width, size.height) / Math.min(size.width, size.height);
  
  // 縦横比が大きい（細長い）場合は線状と判定
  return ratio > 10 && Math.min(size.width, size.height) < 5;
}

// SmartHR用: グループ構成の詳細分析
function analyzeGroupComposition(node) {
  if (!node.children || node.children.length === 0) {
    return {
      total: 0,
      textCount: 0,
      iconCount: 0,
      shapeCount: 0,
      componentCount: 0,
      groupCount: 0,
      otherCount: 0,
      isEmpty: true
    };
  }

  const composition = {
    total: node.children.length,
    textCount: 0,
    iconCount: 0,
    shapeCount: 0,
    componentCount: 0,
    groupCount: 0,
    otherCount: 0,
    isEmpty: false,
    children: []
  };

  // 各子要素を分析
  for (const child of node.children) {
    const childInfo = {
      node: child,
      type: child.type,
      size: getNodeSize(child)
    };

    // 要素タイプ別の分類
    if (child.type === 'TEXT') {
      composition.textCount++;
      childInfo.category = 'text';
    } else if (isIcon(child)) {
      composition.iconCount++;
      childInfo.category = 'icon';
    } else if (isComponent(child)) {
      composition.componentCount++;
      childInfo.category = 'component';
    } else if (isShape(child)) {
      composition.shapeCount++;
      childInfo.category = 'shape';
      // シェイプの用途も分析
      childInfo.shapePurpose = detectShapePurposeSmartHR(child);
    } else if (isGroup(child)) {
      composition.groupCount++;
      childInfo.category = 'group';
      // 再帰的にグループも分析
      childInfo.subComposition = analyzeGroupComposition(child);
    } else {
      composition.otherCount++;
      childInfo.category = 'other';
    }

    composition.children.push(childInfo);
  }

  return composition;
}

// SmartHR用: 要素構成の比率計算
function calculateElementRatios(composition) {
  if (composition.isEmpty || composition.total === 0) {
    return {
      textRatio: 0,
      iconRatio: 0,
      shapeRatio: 0,
      componentRatio: 0,
      groupRatio: 0,
      otherRatio: 0,
      dominantType: 'none'
    };
  }

  const ratios = {
    textRatio: composition.textCount / composition.total,
    iconRatio: composition.iconCount / composition.total,
    shapeRatio: composition.shapeCount / composition.total,
    componentRatio: composition.componentCount / composition.total,
    groupRatio: composition.groupCount / composition.total,
    otherRatio: composition.otherCount / composition.total
  };

  // 支配的な要素タイプを決定
  let maxRatio = 0;
  let dominantType = 'none';
  
  for (const [type, ratio] of Object.entries(ratios)) {
    if (ratio > maxRatio) {
      maxRatio = ratio;
      dominantType = type.replace('Ratio', '');
    }
  }

  ratios.dominantType = dominantType;
  ratios.maxRatio = maxRatio;

  return ratios;
}

// SmartHR用: 混合グループの役割判定
function detectMixedGroupPurpose(node) {
  const composition = analyzeGroupComposition(node);
  const ratios = calculateElementRatios(composition);

  // 空のグループ
  if (composition.isEmpty) {
    return 'group';
  }

  // 位置によるヘッダー/フッター判定
  const positionRole = detectPositionBasedRole(node);
  if (positionRole === 'header' || positionRole === 'footer') {
    return positionRole;
  }

  // 単一要素タイプが支配的な場合（80%以上）
  if (ratios.maxRatio >= 0.8) {
    switch (ratios.dominantType) {
      case 'text':
        return 'text';
      case 'shape':
        // シェイプの場合はさらに用途を判定
        return analyzeDominantShapePurpose(node);
    }
  }

  // ラベル判定（厳密な基準）
  if (isFormLabelGroup(composition, ratios, node)) {
    return 'label';
  }

  // 複数テキストの場合
  if (composition.textCount >= 2) {
    return 'text';  // 複数テキストは単に text として扱う
  }

  // 背景的なシェイプが含まれる場合
  if (hasBackgroundLikeShape(composition)) {
    return 'base';
  }

  // 境界線的な要素が含まれる場合
  if (hasBorderLikeElements(composition)) {
    return 'border';
  }

  // デフォルトは支配的なタイプに基づく
  if (ratios.maxRatio >= 0.5) {
    switch (ratios.dominantType) {
      case 'text':
        return 'text';
      case 'shape':
        const shapePurpose = analyzeDominantShapePurpose(node);
        return shapePurpose !== 'shape' ? shapePurpose : 'base';
      default:
        return 'group';
    }
  }

  return 'group';
}

// ボタンライクなグループかどうか判定
function isButtonLikeGroup(composition, ratios) {
  // 要素数が少ない（1-4個）
  if (composition.total > 4) return false;

  // アイコン+テキストの組み合わせ
  if (composition.iconCount >= 1 && composition.textCount >= 1) {
    return true;
  }

  // テキスト+シェイプ（背景）の組み合わせ
  if (composition.textCount >= 1 && composition.shapeCount >= 1) {
    // シェイプが背景として機能しているか確認
    const hasBackgroundShape = composition.children.some(child => 
      child.category === 'shape' && 
      child.shapePurpose === 'base' &&
      child.size.area > 1000  // 十分な大きさ
    );
    return hasBackgroundShape;
  }

  return false;
}

// カードライクなグループかどうか判定
function isCardLikeGroup(composition, ratios) {
  // 要素数が多い（3個以上）
  if (composition.total < 3) return false;

  // 背景シェイプ + 複数のコンテンツ要素
  const hasBackgroundShape = composition.children.some(child => 
    child.category === 'shape' && 
    child.shapePurpose === 'base' &&
    child.size.area > 5000  // 大きな背景
  );

  const hasMultipleContent = (composition.textCount + composition.iconCount) >= 2;

  return hasBackgroundShape && hasMultipleContent;
}

// ナビゲーションライクなグループかどうか判定
function isNavigationGroup(composition, ratios) {
  // 水平または垂直に配列された同種要素
  if (composition.total < 2) return false;

  // 同じタイプの要素が多い
  const hasSimilarElements = ratios.maxRatio >= 0.6;
  
  // テキストまたはボタンライクな要素が主体
  const isNavigationContent = composition.textCount >= 2 || 
    (composition.iconCount >= 1 && composition.textCount >= 1);

  return hasSimilarElements && isNavigationContent;
}

// ラベルライクなグループかどうか判定  
function isLabelLikeGroup(composition, ratios) {
  // 少数の要素（1-3個）
  if (composition.total > 3) return false;

  // テキスト中心
  if (ratios.textRatio >= 0.5) return true;

  // アイコン+テキストの単純な組み合わせ
  if (composition.iconCount === 1 && composition.textCount === 1) return true;

  return false;
}

// SmartHR用: 位置ベースの役割判定（ヘッダー/フッター）
function detectPositionBasedRole(node) {
  const position = getNodePosition(node);
  const size = getNodeSize(node);
  const name = node.name ? node.name.toLowerCase() : '';

  // レイヤー名による判定
  if (name.includes('header') || name.includes('ヘッダー')) {
    return 'header';
  }
  if (name.includes('footer') || name.includes('フッター')) {
    return 'footer';
  }

  // 位置による判定（ページの上部/下部）
  // 注：この判定は親要素のコンテキストが必要なため、簡易的な実装
  if (position.y < 100 && size.width > 300) {
    // ページ上部の幅広要素
    return 'header';
  }

  // 親要素のサイズと比較してフッター判定をするには、より詳細な情報が必要
  // 現時点では名前ベースの判定のみ実装

  return null;
}

// SmartHR用: フォーム用ラベルの厳密判定
function isFormLabelGroup(composition, ratios, node) {
  const name = node.name ? node.name.toLowerCase() : '';
  
  // レイヤー名による判定
  if (name.includes('label') || name.includes('ラベル')) {
    return true;
  }

  // 以下の条件を全て満たす場合のみラベルと判定
  // 1. テキストが含まれている
  // 2. 要素数が少ない（1-3個）
  // 3. 隣接する要素にフォーム要素がある（実装は困難なため現時点では除外）
  
  if (composition.textCount >= 1 && 
      composition.total <= 3 && 
      ratios.textRatio >= 0.5) {
    
    // サイズが小さい（ラベルらしい）
    const size = getNodeSize(node);
    if (size.width < 200 && size.height < 100) {
      return true;
    }
  }

  return false;
}

// 背景的なシェイプが含まれるかどうか
function hasBackgroundLikeShape(composition) {
  return composition.children.some(child => 
    child.category === 'shape' && 
    child.shapePurpose === 'base' &&
    child.size.area > 2000  // 十分大きな背景
  );
}

// 境界線的な要素が含まれるかどうか
function hasBorderLikeElements(composition) {
  return composition.children.some(child => 
    child.category === 'shape' && 
    child.shapePurpose === 'border'
  );
}

// SmartHR用: コンポーネントの用途推定
function inferComponentPurpose(node) {
  const size = getNodeSize(node);
  const composition = analyzeGroupComposition(node);
  
  // サイズベースの判定
  const sizeCategory = categorizeComponentSize(size);
  
  // 構造ベースの判定
  let structuralPurpose = 'unknown';
  
  if (composition.isEmpty) {
    structuralPurpose = 'placeholder';
  } else if (isButtonLikeGroup(composition, calculateElementRatios(composition))) {
    structuralPurpose = 'button';
  } else if (isCardLikeGroup(composition, calculateElementRatios(composition))) {
    structuralPurpose = 'card';
  } else if (composition.textCount > 0 && composition.total <= 2) {
    structuralPurpose = 'text';
  } else if (composition.iconCount > 0 && composition.total <= 2) {
    structuralPurpose = 'icon';
  } else if (composition.total >= 5) {
    structuralPurpose = 'container';
  }

  return {
    sizeCategory,
    structuralPurpose,
    composition
  };
}

// コンポーネントサイズの分類
function categorizeComponentSize(size) {
  const area = size.area;
  
  if (area < 1000) {
    return 'small';  // アイコン、小さなボタン
  } else if (area < 5000) {
    return 'medium'; // 通常のボタン、フィールド
  } else if (area < 20000) {
    return 'large';  // カード、パネル
  } else {
    return 'xlarge'; // ページレベルのコンテナ
  }
}

// SmartHR用: 意味のあるコンポーネント名生成
function generateSemanticComponentName(node, purpose) {
  const { sizeCategory, structuralPurpose } = purpose;
  
  // 構造的な用途に基づく命名
  switch (structuralPurpose) {
    case 'button':
      return sizeCategory === 'small' ? 'IconButton' : 'Button';
    
    case 'card':
      return sizeCategory === 'large' ? 'Card' : 'Panel';
    
    case 'text':
      return sizeCategory === 'small' ? 'Label' : 'Heading';
    
    case 'icon':
      return 'Icon';
    
    case 'container':
      switch (sizeCategory) {
        case 'xlarge':
          return 'Container';
        case 'large':
          return 'Section';
        default:
          return 'Group';
      }
    
    case 'placeholder':
      return 'Placeholder';
    
    default:
      // サイズのみに基づく推定
      switch (sizeCategory) {
        case 'small':
          return 'Element';
        case 'medium':
          return 'Component';
        case 'large':
          return 'Panel';
        case 'xlarge':
          return 'Container';
        default:
          return 'Component';
      }
  }
}

// SmartHR用: レイヤー命名システム（改良版）
async function generateLayerName(nodeInfo, settings) {
  const layerType = nodeInfo.layerType;
  const node = nodeInfo.node;
  
  // コンポーネントの場合：コンポーネント名をそのまま使用
  if (layerType === 'component') {
    return await getComponentName(node);
  }
  
  // SmartHR命名規則に従った固定命名
  switch (layerType) {
    // SmartHR基本要素
    case 'text':
      return 'text';
    case 'base':
      return 'base';
    case 'border':
      return 'border';
    case 'mask':
      return 'mask';
    case 'label':
      return 'label';
    case 'header':
      return 'header';
    case 'footer':
      return 'footer';
    case 'group':
      return 'group';
    // その他（SmartHRには無いが必要な場合）
    default:
      return 'group';  // 役割不明な場合のみgroupを使用
  }
}

// SmartHR用: 既存の汎用名を改善された名前に置換
function shouldReplaceGenericName(currentName, newLayerType) {
  const genericPatterns = [
    /^group\s*\d*$/i,           // "group", "group 1", "group2" など
    /^mask\s*\d*$/i,            // "mask", "mask 1", "mask2" など  
    /^shape\s*\d*$/i,           // "shape", "shape 1", "shape2" など
    /^rectangle\s*\d*$/i,       // "rectangle", "rectangle 1" など
    /^ellipse\s*\d*$/i,         // "ellipse", "ellipse 1" など
    /^frame\s*\d*$/i,           // "frame", "frame 1" など
    /^vector\s*\d*$/i,          // "vector", "vector 1" など
    /^layer\s*\d*$/i,           // "layer", "layer 1" など
    /^untitled\s*\d*$/i,        // "untitled", "untitled 1" など
  ];
  
  // 現在の名前が汎用的なパターンに一致し、新しいレイヤータイプが明確な役割を持つ場合は置換
  const isGenericName = genericPatterns.some(pattern => pattern.test(currentName.trim()));
  const hasSpecificRole = [
    'text', 'base', 'border', 'mask', 'label', 'header', 'footer'
  ].includes(newLayerType);
  
  return isGenericName && hasSpecificRole;
}

// コンポーネント名を取得（非同期・SmartHR対応）
async function getComponentName(node) {
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    // コンポーネント定義の場合
    if (node.name && node.name !== 'Component' && !node.name.startsWith('Component')) {
      return node.name;  // 意味のある名前がある場合はそのまま使用
    }
    
    // 汎用名の場合は意味のある名前を生成
    const purpose = inferComponentPurpose(node);
    return generateSemanticComponentName(node, purpose);
    
  } else if (node.type === 'INSTANCE') {
    // インスタンスの場合、マスターコンポーネント名を使用
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (mainComponent && mainComponent.name) {
        // マスターコンポーネントに意味のある名前がある場合
        if (mainComponent.name !== 'Component' && !mainComponent.name.startsWith('Component')) {
          return mainComponent.name;
        }
        
        // マスターコンポーネントも汎用名の場合は推定
        const purpose = inferComponentPurpose(mainComponent);
        return generateSemanticComponentName(mainComponent, purpose);
      }
    } catch (error) {
      console.warn('メインコンポーネントの取得に失敗:', error);
    }
    
    // フォールバック：インスタンス自体を分析
    if (node.name && node.name !== 'Component' && !node.name.startsWith('Component')) {
      return node.name;
    }
    
    const purpose = inferComponentPurpose(node);
    return generateSemanticComponentName(node, purpose);
  }
  
  // その他のノードタイプ
  if (node.name && node.name !== 'Component' && !node.name.startsWith('Component')) {
    return node.name;
  }
  
  const purpose = inferComponentPurpose(node);
  return generateSemanticComponentName(node, purpose);
}

// レイヤーの連番処理
function applySequentialNumbering(selectedNodes, newNames) {
  const nameCounters = {};
  const finalNames = [];
  
  for (let i = 0; i < selectedNodes.length; i++) {
    const node = selectedNodes[i];
    const baseName = newNames[i];
    
    // 同じ名前のカウンターを管理
    if (nameCounters[baseName]) {
      nameCounters[baseName]++;
      finalNames.push(`${baseName} ${nameCounters[baseName]}`);
    } else {
      // 同じ名前が複数ある場合は最初から番号を付ける
      const sameNameCount = newNames.filter(name => name === baseName).length;
      if (sameNameCount > 1) {
        nameCounters[baseName] = 1;
        finalNames.push(`${baseName} 1`);
      } else {
        // 単独の場合は番号なし
        finalNames.push(baseName);
      }
    }
  }
  
  return finalNames;
}

// ノード位置を取得
function getNodePosition(node) {
  return {
    x: node.x || 0,
    y: node.y || 0
  };
}

// ノードプロパティを抽出
function extractNodeProperties(node) {
  const props = {};
  
  if (node.type === 'RECTANGLE' || node.type === 'FRAME') {
    props.cornerRadius = node.cornerRadius || 0;
  }
  
  if ('fills' in node && node.fills && node.fills.length > 0) {
    props.hasFill = true;
  }
  
  if ('strokes' in node && node.strokes && node.strokes.length > 0) {
    props.hasStroke = true;
  }
  
  return props;
}

// シンプルな名前を生成
function generateSimpleName(nodeInfo, settings) {
  const parts = [];
  
  // AI によるアイコン識別結果を優先
  if (nodeInfo.aiIconName && settings.aiIconRecognition) {
    parts.push('icon');
    parts.push(nodeInfo.aiIconName);
  } else {
    // レイヤータイプを含める
    if (settings.includeLayerType) {
      if (nodeInfo.component !== 'element') {
        // 候補タイプは基本タイプとして表示
        const componentName = nodeInfo.component.replace('-candidate', '');
        parts.push(componentName);
      } else {
        parts.push(nodeInfo.type);
      }
    }
    
    // テキストコンテンツを含める
    if (settings.useTextContent && nodeInfo.content) {
      parts.push(nodeInfo.content);
    }
  }
  
  // サイズ情報を含める
  if (settings.considerSize && nodeInfo.size) {
    const sizeDesc = getSizeDescription(nodeInfo.size);
    if (sizeDesc) {
      parts.push(sizeDesc);
    }
  }
  
  return parts.join('_') || `${nodeInfo.type}_element`;
}

// デザインシステム名を生成
function generateDesignSystemName(nodeInfo, convention, settings) {
  const template = convention.format;
  const separator = convention.separator;
  
  // React + FontAwesome形式の場合は専用処理
  if (convention.caseStyle === 'pascal') {
    return generateReactFontAwesomeName(nodeInfo, convention, settings);
  }
  
  const values = {
    // 既存のフォーマット用
    component: nodeInfo.aiIconName && settings.aiIconRecognition ? 
               `icon-${nodeInfo.aiIconName}` : nodeInfo.component,
    style: getStyleVariant(nodeInfo),
    priority: getPriority(nodeInfo),
    element: nodeInfo.type,
    state: getState(nodeInfo),
    size: getSizeVariant(nodeInfo.size),
    emphasis: getEmphasis(nodeInfo),
    density: getDensity(nodeInfo),
    type: getTypeVariant(nodeInfo),
    variant: getVariant(nodeInfo),
    
    // Ajike新形式用
    object: getObjectType(nodeInfo),
    part: getPartType(nodeInfo),
    status: getStatusType(nodeInfo)
  };
  
  // テンプレートに値を適用
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(`{${key}}`, value || 'default');
  }
  
  return result;
}

// React + FontAwesome専用の名前生成
function generateReactFontAwesomeName(nodeInfo, convention, settings) {
  let componentName = '';
  let variation = '';
  let state = '';
  
  // 1. ComponentName（パスカルケース）の生成
  componentName = getReactComponentName(nodeInfo, settings);
  
  // 2. variation（キャメルケース）の生成
  variation = getReactVariation(nodeInfo);
  
  // 3. state（キャメルケース）の生成
  state = getReactState(nodeInfo);
  
  // 階層構造の構築
  const parts = [componentName];
  if (variation) parts.push(variation);
  if (state) parts.push(state);
  
  return parts.join('/');
}

// Reactコンポーネント名の生成（パスカルケース）
function getReactComponentName(nodeInfo, settings) {
  const component = nodeInfo.component.replace('-candidate', ''); // 候補サフィックスを除去
  
  // アイコンの場合の特別処理
  if (component === 'icon' || (typeof nodeInfo.component === 'object' && nodeInfo.component.type === 'icon')) {
    if (nodeInfo.aiIconName && settings.aiIconRecognition) {
      // AI認識されたアイコン名を使用
      return `Icon/Fa${toPascalCase(nodeInfo.aiIconName)}`;
    } else {
      // コンテンツベースのアイコン名
      const iconName = extractIconNameFromContent(nodeInfo.content) || 'Icon';
      return `Icon/Fa${toPascalCase(iconName)}`;
    }
  }
  
  // 一般的なコンポーネント名の変換
  const componentMap = {
    'button': 'Button',
    'input': 'Input', 
    'card': 'Card',
    'modal': 'Modal',
    'navbar': 'Navbar',
    'sidebar': 'Sidebar',
    'header': 'Header',
    'footer': 'Footer',
    'badge': 'Badge',
    'list-item': 'ListItem',
    'text': 'Text',
    'heading': 'Heading',
    'label': 'Label',
    // 新規コンポーネント
    'dropdown': 'Dropdown',
    'checkbox': 'Checkbox',
    'radio': 'Radio',
    'toggle': 'Toggle',
    'tabs': 'Tabs',
    'breadcrumb': 'Breadcrumb',
    'progress-bar': 'ProgressBar'
  };
  
  let baseName = componentMap[component] || toPascalCase(component);
  
  // コンテンツに基づく詳細化
  if (nodeInfo.content) {
    const contentModifier = getComponentModifierFromContent(nodeInfo.content, component);
    if (contentModifier) {
      baseName = `${contentModifier}${baseName}`;
    }
  }
  
  return baseName;
}

// Reactバリエーション名の生成（キャメルケース）
function getReactVariation(nodeInfo) {
  const variations = [];
  
  // サイズバリエーション
  const size = getSizeVariant(nodeInfo.size);
  if (size !== 'md') {
    variations.push(size);
  }
  
  // スタイルバリエーション
  const style = getStyleVariant(nodeInfo);
  if (style === 'outline') {
    variations.push('outline');
  }
  
  // アイコン位置（ボタンの場合）
  if (nodeInfo.component.includes('button') && nodeInfo.content) {
    if (hasIconLeft(nodeInfo)) variations.push('iconLeft');
    if (hasIconRight(nodeInfo)) variations.push('iconRight');
  }
  
  return variations.length > 0 ? variations.join('') : '';
}

// Reactステート名の生成（キャメルケース）
function getReactState(nodeInfo) {
  if (!nodeInfo.isVisible) return 'disabled';
  
  // 将来的なステート拡張用
  // hover, active, focus等はFigmaでは検出困難なため、基本は省略
  return '';
}

// 文字列をパスカルケースに変換
function toPascalCase(str) {
  if (!str) return '';
  return str.replace(/(?:^|[\s_-])([a-z])/g, (match, letter) => letter.toUpperCase())
            .replace(/[\s_-]/g, '');
}

// コンテンツからアイコン名を抽出
function extractIconNameFromContent(content) {
  if (!content) return null;
  
  const iconMap = {
    // 日本語
    'ホーム': 'Home', 'ほーむ': 'Home',
    'ハート': 'Heart', 'はーと': 'Heart', 
    '星': 'Star', 'ほし': 'Star',
    'メニュー': 'Menu', 'めにゅー': 'Menu',
    '検索': 'Search', 'けんさく': 'Search',
    'ユーザー': 'User', 'ゆーざー': 'User',
    // 英語・記号
    'home': 'Home', 'heart': 'Heart', 'star': 'Star',
    'menu': 'Menu', 'search': 'Search', 'user': 'User',
    'play': 'Play', 'pause': 'Pause', 'stop': 'Stop',
    'close': 'Times', 'add': 'Plus', 'edit': 'Edit',
    '→': 'ArrowRight', '←': 'ArrowLeft', 
    '↑': 'ArrowUp', '↓': 'ArrowDown',
    '▶': 'Play', '⏸': 'Pause', '■': 'Stop'
  };
  
  const lowerContent = content.toLowerCase();
  for (const [key, value] of Object.entries(iconMap)) {
    if (lowerContent.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return null;
}

// コンテンツからコンポーネント修飾子を取得
function getComponentModifierFromContent(content, componentType) {
  if (!content) return null;
  
  const lowerContent = content.toLowerCase();
  
  // ボタンの修飾子
  if (componentType === 'button') {
    if (lowerContent.includes('primary') || lowerContent.includes('主要')) return 'Primary';
    if (lowerContent.includes('secondary') || lowerContent.includes('副')) return 'Secondary';
    if (lowerContent.includes('danger') || lowerContent.includes('削除') || lowerContent.includes('危険')) return 'Danger';
    if (lowerContent.includes('success') || lowerContent.includes('成功')) return 'Success';
    if (lowerContent.includes('warning') || lowerContent.includes('警告')) return 'Warning';
    if (lowerContent.includes('submit') || lowerContent.includes('送信')) return 'Submit';
  }
  
  // インプットの修飾子
  if (componentType === 'input') {
    if (lowerContent.includes('search') || lowerContent.includes('検索')) return 'Search';
    if (lowerContent.includes('email') || lowerContent.includes('メール')) return 'Email';
    if (lowerContent.includes('password') || lowerContent.includes('パスワード')) return 'Password';
    if (lowerContent.includes('number') || lowerContent.includes('番号')) return 'Number';
  }
  
  return null;
}

// アイコンが左側にあるかチェック
function hasIconLeft(nodeInfo) {
  // 簡易実装：将来的にはより詳細な構造解析が可能
  return false;
}

// アイコンが右側にあるかチェック  
function hasIconRight(nodeInfo) {
  // 簡易実装：将来的にはより詳細な構造解析が可能
  return false;
}

// サイズ説明を取得
function getSizeDescription(size) {
  if (size.area < 2500) return 'small';
  if (size.area > 250000) return 'large';
  if (Math.abs(size.width - size.height) < 10) return 'square';
  if (size.width > size.height * 2) return 'wide';
  if (size.height > size.width * 2) return 'tall';
  return null;
}

// スタイルバリアントを取得
function getStyleVariant(nodeInfo) {
  if (nodeInfo.properties.hasStroke && !nodeInfo.properties.hasFill) return 'outline';
  if (nodeInfo.properties.hasFill) return 'filled';
  return 'default';
}

// 優先度を取得
function getPriority(nodeInfo) {
  if (nodeInfo.component === 'button') return 'primary';
  return 'default';
}

// 状態を取得
function getState(nodeInfo) {
  return nodeInfo.isVisible ? 'default' : 'hidden';
}

// サイズバリアントを取得
function getSizeVariant(size) {
  if (size.area < 2500) return 'sm';
  if (size.area > 250000) return 'lg';
  return 'md';
}

// エンファシスを取得
function getEmphasis(nodeInfo) {
  return 'medium';
}

// 密度を取得
function getDensity(nodeInfo) {
  return 'comfortable';
}

// タイプバリアントを取得
function getTypeVariant(nodeInfo) {
  return nodeInfo.component;
}

// バリアントを取得
function getVariant(nodeInfo) {
  if (nodeInfo.properties.hasStroke) return 'outline';
  return 'solid';
}

// Ajike新形式: オブジェクトタイプを取得
function getObjectType(nodeInfo) {
  const component = nodeInfo.component;
  
  // インタラクティブ要素
  if (['button', 'button-candidate', 'input', 'input-candidate', 'icon-button', 'dropdown', 'checkbox', 'radio', 'toggle'].includes(component)) {
    return 'control';
  }
  
  // フォーム関連
  if (['input', 'textarea', 'select', 'dropdown', 'checkbox', 'radio', 'toggle'].includes(component)) {
    return 'form';
  }
  
  // テキスト要素
  if (['text', 'label', 'heading'].includes(component) || nodeInfo.type === 'TEXT') {
    return 'text';
  }
  
  // レイアウト要素
  if (['card', 'modal', 'navbar', 'sidebar', 'header', 'footer', 'tabs', 'breadcrumb', 'progress-bar'].includes(component)) {
    return 'layout';
  }
  
  return 'element';
}

// Ajike新形式: パートタイプを取得
function getPartType(nodeInfo) {
  // テキスト要素の場合
  if (nodeInfo.type === 'TEXT' || getObjectType(nodeInfo) === 'text') {
    if (nodeInfo.component === 'heading') return 'primary';
    if (nodeInfo.component === 'label') return 'sub';
    return 'default';
  }
  
  // プロパティベースの判定
  if (nodeInfo.properties.hasFill && !nodeInfo.properties.hasStroke) {
    return 'background';
  }
  
  if (nodeInfo.properties.hasStroke) {
    return 'border';
  }
  
  // コンポーネントタイプベースの判定
  if (['icon', 'icon-button'].includes(nodeInfo.component)) {
    return 'icon';
  }
  
  if (['button', 'button-candidate', 'input', 'input-candidate'].includes(nodeInfo.component)) {
    return 'background';
  }
  
  return 'background';
}

// Ajike新形式: ステータスタイプを取得
function getStatusType(nodeInfo) {
  if (!nodeInfo.isVisible) return 'disabled';
  
  // サイズベースの判定
  const size = nodeInfo.size;
  if (size && size.area < 1000) return 'small';
  if (size && size.area > 100000) return 'large';
  
  return 'default';
}

// AI使用量管理の定数
const AI_USAGE_LIMITS = {
  free: 5,
  basic: 100,
  pro: -1 // unlimited
};

const PLAN_PRICES = {
  basic: { monthly: 980, yearly: 9800 },
  pro: { monthly: 2980, yearly: 29800 }
};

// AI使用量を取得
async function handleGetAIUsage() {
  try {
    const usageData = await getAIUsageData();
    
    figma.ui.postMessage({
      type: 'ai-usage-loaded',
      usageData: usageData
    });
  } catch (error) {
    console.error('AI使用量の取得に失敗しました:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'AI使用量の取得に失敗しました'
    });
  }
}

// AI使用量を増加
async function handleIncrementAIUsage() {
  try {
    const usageData = await getAIUsageData();
    
    // 使用制限チェック
    const limit = AI_USAGE_LIMITS[usageData.plan];
    if (limit !== -1 && usageData.count >= limit) {
      figma.ui.postMessage({
        type: 'ai-usage-limit-exceeded',
        usageData: usageData
      });
      return;
    }
    
    // 使用量を増加
    usageData.count++;
    usageData.lastUsed = Date.now();
    
    await figma.clientStorage.setAsync('ai-usage-data', usageData);
    
    figma.ui.postMessage({
      type: 'ai-usage-updated',
      usageData: usageData
    });
    
  } catch (error) {
    console.error('AI使用量の更新に失敗しました:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'AI使用量の更新に失敗しました'
    });
  }
}

// AI使用量をリセット
async function handleResetAIUsage() {
  try {
    const usageData = await getAIUsageData();
    usageData.count = 0;
    usageData.lastReset = Date.now();
    
    await figma.clientStorage.setAsync('ai-usage-data', usageData);
    
    figma.ui.postMessage({
      type: 'ai-usage-updated',
      usageData: usageData
    });
    
  } catch (error) {
    console.error('AI使用量のリセットに失敗しました:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'AI使用量のリセットに失敗しました'
    });
  }
}

// プランアップグレード処理
async function handleUpgradePlan(plan) {
  try {
    if (!['basic', 'pro'].includes(plan)) {
      throw new Error('無効なプランです');
    }
    
    const usageData = await getAIUsageData();
    usageData.plan = plan;
    usageData.upgradeDate = Date.now();
    
    await figma.clientStorage.setAsync('ai-usage-data', usageData);
    
    figma.ui.postMessage({
      type: 'plan-upgraded',
      usageData: usageData,
      message: `${plan === 'basic' ? 'Basic' : 'Pro'}プランにアップグレードしました！`
    });
    
  } catch (error) {
    console.error('プランアップグレードに失敗しました:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'プランアップグレードに失敗しました'
    });
  }
}

// AI使用量データを取得（共通関数）
async function getAIUsageData() {
  const defaultUsageData = {
    plan: 'free',
    count: 0,
    lastReset: Date.now(),
    lastUsed: null,
    upgradeDate: null,
    version: '1.0'
  };
  
  try {
    const stored = await figma.clientStorage.getAsync('ai-usage-data');
    if (!stored) {
      // 初回使用時はデフォルトデータを保存
      await figma.clientStorage.setAsync('ai-usage-data', defaultUsageData);
      return defaultUsageData;
    }
    
    // 月次リセットチェック
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30日
    
    if (now - stored.lastReset > oneMonth) {
      stored.count = 0;
      stored.lastReset = now;
      await figma.clientStorage.setAsync('ai-usage-data', stored);
    }
    
    return Object.assign({}, defaultUsageData, stored);
    
  } catch (error) {
    console.error('AI使用量データの取得に失敗しました:', error);
    return defaultUsageData;
  }
}

// 使用量制限チェック（AI分析前に呼び出す）
async function checkAIUsageLimit() {
  const usageData = await getAIUsageData();
  const limit = AI_USAGE_LIMITS[usageData.plan];
  
  if (limit === -1) {
    // Pro プラン（無制限）
    return { allowed: true, remaining: -1, usageData };
  }
  
  if (usageData.count >= limit) {
    return { 
      allowed: false, 
      remaining: 0, 
      usageData,
      message: `${usageData.plan === 'free' ? 'Free' : 'Basic'}プランの月間利用制限（${limit}回）に達しました。プランをアップグレードしてください。`
    };
  }
  
  return { 
    allowed: true, 
    remaining: limit - usageData.count, 
    usageData 
  };
}

// プラグイン起動時の初期化
figma.on('run', () => {
  console.log('🚀 レイヤー命名君プラグインが起動しました');
  // 設定を読み込み
  figma.ui.postMessage({ type: 'init' });
  
  // 選択されたレイヤー情報をログ出力
  console.log(`📊 現在の選択: ${figma.currentPage.selection.length} レイヤー`);
});

// プラグイン終了時のクリーンアップ
figma.on('close', () => {
  console.log('👋 レイヤー命名君プラグインが終了しました');
  // 待機中のAI分析をクリーンアップ
  if (pendingAIAnalyses.size > 0) {
    console.log(`🔄 ${pendingAIAnalyses.size} 件の未完了AI分析をクリーンアップしています`);
    pendingAIAnalyses.clear();
  }
});