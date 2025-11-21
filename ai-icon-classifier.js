/**
 * AI Icon Classifier using TensorFlow.js + MobileNet
 * ローカルブラウザ内でアイコン内容を識別する軽量AIシステム
 */

// アイコン分類クラス
class IconClassifier {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.modelUrl = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/classification/5/default/1';
    
    // アイコンカテゴリマッピング（ImageNet → アイコン名）
    this.iconMapping = {
      // 基本図形・シンボル
      'heart': ['cardoon', 'artichoke'],
      'star': ['starfish', 'sea star'],
      'circle': ['ring', 'hoop'],
      'square': ['frame', 'border'],
      'triangle': ['triangle'],
      
      // UI要素
      'home': ['house', 'dwelling', 'abode'],
      'search': ['magnifying glass', 'loupe'],
      'settings': ['gear', 'cog', 'cogwheel'],
      'menu': ['hamburger', 'three lines'],
      'close': ['cross', 'x mark'],
      
      // コミュニケーション
      'chat': ['speech bubble', 'balloon'],
      'message': ['envelope', 'letter'],
      'phone': ['telephone', 'handset'],
      'email': ['at symbol', '@'],
      
      // ナビゲーション
      'arrow-up': ['up arrow', 'north'],
      'arrow-down': ['down arrow', 'south'], 
      'arrow-left': ['left arrow', 'west'],
      'arrow-right': ['right arrow', 'east'],
      'chevron-up': ['caret up'],
      'chevron-down': ['caret down'],
      'chevron-left': ['caret left'],
      'chevron-right': ['caret right'],
      
      // アクション
      'add': ['plus', 'addition'],
      'remove': ['minus', 'subtraction'],
      'edit': ['pencil', 'pen'],
      'delete': ['trash', 'bin'],
      'download': ['downward arrow'],
      'upload': ['upward arrow'],
      
      // メディア
      'play': ['play button', 'triangle'],
      'pause': ['pause button', 'parallel lines'],
      'stop': ['stop button', 'square'],
      'volume': ['speaker', 'sound'],
      
      // その他
      'user': ['person', 'profile', 'avatar'],
      'lock': ['padlock', 'security'],
      'unlock': ['open lock'],
      'calendar': ['date', 'schedule'],
      'clock': ['time', 'timepiece'],
      'notification': ['bell', 'alert']
    };
    
    // 使用量トラッキング
    this.usageTracking = {
      count: 0,
      lastReset: Date.now(),
      limit: 5, // Free tier limit
      plan: 'free'
    };
  }

  /**
   * モデルの初期化
   */
  async initializeModel() {
    if (this.isModelLoaded) {
      console.log('✅ モデルは既に読み込み済みです');
      return true;
    }

    try {
      console.log('🤖 AI アイコン認識モデルを初期化中...');
      
      // CDN から TensorFlow.js を動的読み込み
      if (typeof tf === 'undefined') {
        console.log('📦 TensorFlow.js を読み込み中...');
        await this.loadTensorFlowJS();
      } else {
        console.log('✅ TensorFlow.js は既に利用可能です');
      }
      
      // IndexedDB からキャッシュされたモデルを確認
      console.log('🔍 キャッシュされたモデルを確認中...');
      const cachedModel = await this.loadCachedModel();
      if (cachedModel) {
        this.model = cachedModel;
        this.isModelLoaded = true;
        console.log('✅ キャッシュからモデルを読み込みました');
        return true;
      }
      
      // 新規モデル読み込み
      console.log('📥 新しいモデルをダウンロード中...');
      this.model = await tf.loadLayersModel(this.modelUrl);
      
      // モデルをキャッシュに保存
      console.log('💾 モデルをキャッシュに保存中...');
      await this.cacheModel();
      
      this.isModelLoaded = true;
      console.log('✅ AI アイコン認識の準備が完了しました');
      return true;
      
    } catch (error) {
      console.error('❌ AI モデルの初期化に失敗しました:', error);
      console.error('詳細:', {
        errorName: error.name,
        errorMessage: error.message,
        modelUrl: this.modelUrl,
        tfAvailable: typeof tf !== 'undefined'
      });
      return false;
    }
  }

  /**
   * TensorFlow.js の動的読み込み（必要な場合のみ）
   */
  async loadTensorFlowJS() {
    return new Promise((resolve, reject) => {
      // 既に読み込まれている場合はスキップ
      if (typeof tf !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.15.0/dist/tf.min.js';
      script.onload = () => {
        console.log('✅ TensorFlow.js が動的に読み込まれました');
        resolve();
      };
      script.onerror = (error) => {
        console.error('❌ TensorFlow.js の読み込みに失敗しました:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  /**
   * キャッシュされたモデルの読み込み
   */
  async loadCachedModel() {
    try {
      const model = await tf.loadLayersModel('indexeddb://icon-classifier');
      return model;
    } catch (error) {
      console.log('キャッシュされたモデルが見つかりません');
      return null;
    }
  }

  /**
   * モデルをキャッシュに保存
   */
  async cacheModel() {
    try {
      await this.model.save('indexeddb://icon-classifier');
      console.log('✅ モデルをキャッシュに保存しました');
    } catch (error) {
      console.warn('⚠️ モデルのキャッシュに失敗しました:', error);
    }
  }

  /**
   * 使用量チェック
   */
  checkUsageLimit() {
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30日

    // 月次リセット
    if (now - this.usageTracking.lastReset > oneMonth) {
      this.usageTracking.count = 0;
      this.usageTracking.lastReset = now;
      this.saveUsageData();
    }

    // 制限チェック
    if (this.usageTracking.plan === 'free' && this.usageTracking.count >= this.usageTracking.limit) {
      return {
        allowed: false,
        remaining: 0,
        plan: this.usageTracking.plan,
        message: 'Free プランの月間利用制限に達しました。Pro プランにアップグレードしてください。'
      };
    }

    return {
      allowed: true,
      remaining: this.usageTracking.plan === 'free' ? 
        (this.usageTracking.limit - this.usageTracking.count) : -1,
      plan: this.usageTracking.plan,
      message: ''
    };
  }

  /**
   * 使用量を増加
   */
  incrementUsage() {
    this.usageTracking.count++;
    this.saveUsageData();
  }

  /**
   * 使用量データの保存（UI側では直接保存しない）
   */
  saveUsageData() {
    // UI側では保存操作を行わず、プラグイン側に通知
    if (typeof parent !== 'undefined' && parent.postMessage) {
      parent.postMessage({
        pluginMessage: {
          type: 'save-ai-usage',
          usageData: this.usageTracking
        }
      }, '*');
    }
  }

  /**
   * 使用量データの読み込み（UI側では直接読み込まない）
   */
  async loadUsageData() {
    // UI側では初期化時にプラグイン側からデータを受け取る
    // この関数は互換性のためのスタブ
    console.log('UI側での使用量データ読み込みはプラグイン側で管理されます');
  }

  /**
   * 画像前処理：MobileNet用に224x224にリサイズ・正規化
   */
  preprocessImage(imageData) {
    return tf.tidy(() => {
      // ImageDataからテンソルに変換
      let tensor = tf.browser.fromPixels(imageData);
      
      // 224x224にリサイズ
      tensor = tf.image.resizeBilinear(tensor, [224, 224]);
      
      // バッチ次元を追加 [1, 224, 224, 3]
      tensor = tensor.expandDims(0);
      
      // 0-1の範囲に正規化
      tensor = tensor.div(255.0);
      
      return tensor;
    });
  }

  /**
   * アイコン分類の実行
   */
  async classifyIcon(imageData) {
    // 使用量制限チェック
    const usageCheck = this.checkUsageLimit();
    if (!usageCheck.allowed) {
      throw new Error(usageCheck.message);
    }

    if (!this.isModelLoaded) {
      const initialized = await this.initializeModel();
      if (!initialized) {
        throw new Error('AI モデルの初期化に失敗しました');
      }
    }

    try {
      // 画像前処理
      const preprocessed = this.preprocessImage(imageData);
      
      // 予測実行
      const predictions = await this.model.predict(preprocessed);
      const probabilities = await predictions.data();
      
      // トップ5の予測結果を取得
      const top5 = this.getTop5Predictions(probabilities);
      
      // アイコン名にマッピング
      const iconName = this.mapToIconName(top5);
      
      // 使用量を増加
      this.incrementUsage();
      
      // メモリクリーンアップ
      preprocessed.dispose();
      predictions.dispose();
      
      return {
        iconName: iconName,
        confidence: top5[0].probability,
        alternatives: top5.slice(1, 3).map(p => this.mapToIconName([p])),
        usage: {
          remaining: usageCheck.remaining - 1,
          plan: this.usageTracking.plan
        }
      };
      
    } catch (error) {
      console.error('アイコン分類中にエラーが発生しました:', error);
      throw new Error('アイコンの分析に失敗しました');
    }
  }

  /**
   * トップ5の予測結果を取得
   */
  getTop5Predictions(probabilities) {
    const predictions = Array.from(probabilities)
      .map((probability, index) => ({ probability, index }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);
    
    return predictions;
  }

  /**
   * ImageNet分類結果をアイコン名にマッピング
   */
  mapToIconName(predictions) {
    // ImageNet クラス名を取得（簡略版 - 実際はクラス辞書が必要）
    const getImageNetClass = (index) => {
      // 主要なアイコン関連クラス（例）
      const classes = {
        0: 'background',
        1: 'gear',
        2: 'heart', 
        3: 'star',
        4: 'house',
        5: 'arrow',
        // ... 実際は1000クラス
      };
      return classes[index] || 'unknown';
    };

    for (const prediction of predictions) {
      const className = getImageNetClass(prediction.index);
      
      // マッピング辞書から最適なアイコン名を検索
      for (const [iconName, keywords] of Object.entries(this.iconMapping)) {
        if (keywords.some(keyword => 
          className.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(className.toLowerCase())
        )) {
          return iconName;
        }
      }
    }
    
    // マッピングが見つからない場合は汎用名
    return 'icon';
  }

  /**
   * 使用状況の取得
   */
  getUsageStatus() {
    return {
      count: this.usageTracking.count,
      limit: this.usageTracking.limit,
      remaining: Math.max(0, this.usageTracking.limit - this.usageTracking.count),
      plan: this.usageTracking.plan,
      resetDate: new Date(this.usageTracking.lastReset + (30 * 24 * 60 * 60 * 1000))
    };
  }

  /**
   * プランのアップグレード
   */
  upgradePlan(newPlan) {
    this.usageTracking.plan = newPlan;
    if (newPlan === 'basic') {
      this.usageTracking.limit = 100;
    } else if (newPlan === 'pro') {
      this.usageTracking.limit = -1; // unlimited
    }
    this.saveUsageData();
  }
}

// グローバルインスタンス
let iconClassifier = null;

/**
 * アイコン分類器の初期化
 */
async function initializeIconClassifier() {
  if (!iconClassifier) {
    iconClassifier = new IconClassifier();
    await iconClassifier.loadUsageData();
  }
  return iconClassifier;
}

/**
 * アイコンを分類（メイン関数）
 */
async function classifyIcon(imageData) {
  const classifier = await initializeIconClassifier();
  return await classifier.classifyIcon(imageData);
}

/**
 * 使用状況を取得
 */
async function getUsageStatus() {
  const classifier = await initializeIconClassifier();
  return classifier.getUsageStatus();
}

/**
 * プランをアップグレード
 */
async function upgradePlan(newPlan) {
  const classifier = await initializeIconClassifier();
  classifier.upgradePlan(newPlan);
}

// エクスポート（ブラウザ環境用）
if (typeof window !== 'undefined') {
  window.IconClassifier = IconClassifier;
  window.classifyIcon = classifyIcon;
  window.getUsageStatus = getUsageStatus;
  window.upgradePlan = upgradePlan;
}

// Node.js環境用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IconClassifier,
    classifyIcon,
    getUsageStatus,
    upgradePlan
  };
}