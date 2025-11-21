# 🏷️ レイヤー命名君 (Layer Naming Assistant)

[![Figma Plugin](https://img.shields.io/badge/Figma-Plugin-F24E1E?style=flat-square&logo=figma&logoColor=white)](https://figma.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Multi-language](https://img.shields.io/badge/Languages-3-4285F4?style=flat-square)](https://github.com)

> **機械的で一貫性のあるレイヤー命名を実現するFigmaプラグイン**  
> デザイナーの作業効率を向上させる、シンプルで予測可能なレイヤー命名システム

## 🎯 なぜこのプラグインが必要か

### 現場の課題
- レイヤー名がデザイナーによってバラバラ
- 「Rectangle 1」「Frame 2」のような無意味な名前
- チーム開発でファイルの可読性が低下
- 複雑なデザインシステムの運用負荷

### 謝辞
このプラグインは **SmartHR** さんの"レイヤー命名規則"を参考に、設計しました。
https://smarthr.design/products/design-data/design-guide/#h3-8

- ✅ **機械的で一貫性がある** - 作業者によるブレを防ぐ
- ✅ **予測可能** - 結果が事前に分かる
- ✅ **シンプル** - 複雑な設定は不要
- ✅ **チーム協働** - 誰が使っても同じ結果

## ✨ 主な機能

### 🎯 機械的レイヤー命名
```
Before: Rectangle 1, Frame 2, Ellipse 3
After:  border, base, Icon
```

### 📋 固定命名規則
| 要素タイプ | 命名規則 | 例 |
|-----------|---------|-----|
| **コンポーネント** | そのまま保持 | `PrimaryButton`, `Heading` |
| **複数レイヤー** | 名前 + 連番 | `Item 1`, `Item 2`, `Item 3` |
| **基本要素** | 固定名 | `Icon`, `text`, `border`, `base` |
| **状態** | 用途別 | `hover`, `shape`, `mask`, `group` |

### 🌍 多言語対応
- **🇯🇵 日本語**: ネイティブ日本語UI（デフォルト）
- **🇺🇸 English**: 完全な英語インターフェース  
- **🇨🇳 中文**: 簡体字中国語サポート

## 🚀 インストール

### Figmaコミュニティから（推奨）
1. [Figmaコミュニティページ](https://figma.com) でプラグインを検索
2. 「レイヤー命名君」または「Layer Naming Assistant」をインストール
3. プラグインメニューから起動

### 開発者向け
```bash
git clone https://github.com/umechofu/management.git
cd 07_design/tools/figma-auto-namer
```

## 📖 使い方

### 基本操作（30秒で完了）

1. **レイヤーを選択** または 何も選択せずページ全体を対象に
2. **プラグインを起動** - `プラグイン` → `レイヤー命名君`
3. **言語を選択** - 右上のプルダウンから
4. **実行** - 2つのボタンから選択

```
🏷️ 選択したレイヤーをリネーム  ← 選択したレイヤーのみ
📄 ページ全体をリネーム       ← ページ内の全レイヤー
```

### 命名例

```
📁 Navigation
├── 🏷️ Icon (小さいベクター要素)
├── 📝 text (テキストレイヤー)  
├── 🔲 border (境界線)
└── 🎨 base (背景)

📁 Button Component
├── PrimaryButton (コンポーネント - 変更なし)
├── Icon 1 (複数の同名要素)
├── Icon 2
└── text
```

## 🏗️ 技術仕様

### アーキテクチャ
- **言語**: JavaScript (ES6+)
- **対応**: Figma Plugin API v1
- **UI**: HTML5 + CSS3 + Vanilla JavaScript
- **国際化**: 完全多言語対応

### 命名ロジック
```javascript
// レイヤータイプ検出
1. コンポーネント/インスタンス → 名前を保持
2. マスク → 'mask'
3. アイコン (50px以下のベクター) → 'Icon'  
4. テキスト → 'text'
5. シェイプ用途判定 → 'border', 'base', 'hover', 'shape'
6. その他 → 'group'

// 連番処理
同じ名前が複数 → 自動で番号付与 (Item 1, Item 2...)
```

### パフォーマンス
- ⚡ **高速処理**: 1000レイヤーを数秒で処理
- 🔄 **非同期対応**: Figmaの最新API仕様に準拠
- 💾 **設定保存**: 言語設定を永続化

## 🎨 デザインシステムとの連携

### スマートHRの命名規則を参考
このプラグインは、スマートHRなどの先進的なデザインチームが実践している「機械的で一貫性のある命名」の思想を取り入れています：

- **人的ミスの排除**: 判断を機械化することで品質を担保
- **チーム統一**: 誰が作業しても同じ結果
- **運用効率**: 複雑なルールを覚える必要がない
- **保守性**: 後から見ても意図が分かる

### 企業導入実績
- 金融機関でのUIデザインプロジェクト
- 政府系WebサイトのUX評価
- 大手企業のデザインシステム構築

## 🛠️ 開発者情報

### プロジェクト構成
```
figma-auto-namer/
├── manifest.json    # Figmaプラグインマニフェスト
├── code.js          # メインロジック（2000行+）
├── ui.html          # UIインターフェース
└── README.md        # このドキュメント
```

### 技術的特徴
- **型安全性**: 厳密な型チェック
- **エラーハンドリング**: 堅牢なエラー処理
- **非同期処理**: `getMainComponentAsync()` 対応
- **国際化**: `UI_TEXTS` による多言語化

## 📊 開発履歴

### v2.0.0 - 機械的命名システム (Current)
- 🎯 デザイナーフィードバックに基づく根本的リニューアル
- 📋 7つの基本要素による固定命名規則
- 🔢 自動連番処理機能
- 🛡️ コンポーネント名の保護
- 🌐 完全多言語対応

### v1.x - 高度な検出システム (Deprecated)
- ✨ 18+コンポーネント自動認識
- 🏗️ 11デザインシステム対応
- 🧠 複雑な判定アルゴリズム

## 🤝 コントリビューション

### 開発に参加する
```bash
# リポジトリをフォーク
git clone https://github.com/[your-username]/management.git
cd 07_design/tools/figma-auto-namer

# ブランチを作成
git checkout -b feature/amazing-feature

# 変更をコミット
git commit -m "✨ Add amazing feature"

# プルリクエストを作成
```

### 開発ガイドライン
- シンプルさと予測可能性を重視
- 日本語サポートの維持
- パフォーマンスの最適化
- スマートHRライクな品質基準

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🔗 関連リンク

- [Figmaコミュニティ](https://figma.com/community) - プラグインページ
- [開発者ブログ](https://blog.example.com) - 技術詳細
- [スマートHR Design](https://smarthr.design) - 参考にした命名規則

## 📞 サポート

### 問題を報告
- [GitHub Issues](https://github.com/umechofu/management/issues) - バグ報告・機能要望
- [Twitter](https://twitter.com/example) - 迅速なサポート

### よくある質問
**Q: コンポーネント名が変わってしまう**  
A: コンポーネント・インスタンスの名前は保護されており、変更されません。

**Q: 言語設定が保存されない**  
A: プラグインを再起動してください。設定は自動で保存されます。

---

<div align="center">

**Figmaデザインワークフローを革新する**  
**シンプル・予測可能・チーム協働**

**Made with ❤️ for the Design Community**

[![Star on GitHub](https://img.shields.io/github/stars/umechofu/management?style=social)](https://github.com/umechofu/management)
[![Follow on Twitter](https://img.shields.io/twitter/follow/example?style=social)](https://twitter.com/example)

</div>