# MotoMatcher

バイク愛好家（ライダー）とフォトグラファーをマッチングするプラットフォーム

![MotoMatcher Logo](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=MotoMatcher)

## 🎯 概要

MotoMatcherは、バイク撮影を依頼したいライダーと、バイク撮影のスキルを持つフォトグラファーを繋ぐマッチングプラットフォームです。

### 主な機能

- 🔐 **ユーザー認証** - AWS Cognito / Mock環境での認証
- 👤 **プロフィール管理** - ライダー・フォトグラファーの詳細情報
- 🔍 **検索・フィルタリング** - 都道府県・ジャンルでの絞り込み
- 💬 **リアルタイムメッセージ** - フォトグラファーとの直接やり取り
- ⭐ **レビュー・評価システム** - 5段階評価とコメント
- 📸 **ポートフォリオ** - フォトグラファーの作品ギャラリー
- 📱 **レスポンシブデザイン** - PC・タブレット・スマートフォン対応

---

## 🛠️ 技術スタック

### フロントエンド

- **React 18.2.0** - UIライブラリ
- **Vite 6.1.0** - 高速ビルドツール
- **React Router v7** - ルーティング
- **TanStack Query v5** - データフェッチ・キャッシュ
- **Tailwind CSS** - ユーティリティファーストCSS
- **Framer Motion** - アニメーション
- **shadcn/ui** (Radix UI) - UIコンポーネント

### バックエンド（本番環境）

- **AWS Amplify** - フルスタックフレームワーク
- **AWS Cognito** - ユーザー認証
- **AWS AppSync** - GraphQL API
- **Amazon DynamoDB** - NoSQLデータベース
- **Amazon S3** - ファイルストレージ

### 開発環境

- **Mock Services** - ローカル開発用モックサービス
- **localStorage** - データ永続化

---

## 📦 セットアップ

### 必要要件

- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/motomatcher.git
cd motomatcher

# 依存パッケージのインストール
npm install
```

### 環境設定

#### 1. Mock環境（開発用・推奨）

Mock環境はAWSサービスなしで動作します。すぐに開発を始められます。

```bash
# デフォルトでMock環境が有効
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

**Mock環境の特徴：**
- ✅ AWSアカウント不要
- ✅ ローカルストレージにデータ保存
- ✅ 高速な開発サイクル
- ✅ 確認コードは固定（`123456`）

#### 2. AWS本番環境

AWS本番環境で動作させる場合：

```bash
# Amplify CLI のインストール
npm install -g @aws-amplify/cli

# Amplify の初期化
amplify init

# バックエンドリソースのデプロイ
amplify push

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集して、AWS の値を設定
```

`src/config/environment.js` で `useMock = false` に変更：

```javascript
export const useMock = false;
```

---

## 🚀 開発

### 開発サーバーの起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

---

## 📂 プロジェクト構造

```
motomatcher/
├── amplify/                    # AWS Amplify設定
│   └── backend/
│       └── api/motomatcher/
│           └── schema.graphql  # GraphQLスキーマ
│
├── src/
│   ├── components/            # 再利用可能コンポーネント
│   │   ├── auth/              # 認証コンポーネント
│   │   ├── home/              # ホーム画面コンポーネント
│   │   ├── messages/          # メッセージコンポーネント
│   │   ├── photographer/      # フォトグラファーコンポーネント
│   │   ├── profile/           # プロフィールコンポーネント
│   │   └── ui/                # UIコンポーネント（shadcn/ui）
│   │
│   ├── pages/                 # ページコンポーネント
│   │   ├── HomeForNonRegister.jsx    # 未認証ホーム
│   │   ├── HomeForRegister.jsx       # 認証済みホーム
│   │   ├── FirstTimeProfileSetup.jsx # 初回プロフィール設定
│   │   ├── Profile.jsx               # プロフィール編集
│   │   ├── PhotographerDetail.jsx    # フォトグラファー詳細
│   │   ├── MessageList.jsx           # メッセージ一覧
│   │   ├── UserMessage.jsx           # 個別チャット
│   │   ├── Reviews.jsx               # レビュー一覧
│   │   ├── Terms.jsx                 # 利用規約
│   │   └── Layout.jsx                # 共通レイアウト
│   │
│   ├── services/              # Mockサービス
│   │   ├── mockAuthService.js  # 認証モック
│   │   ├── mockAPIService.js   # APIモック
│   │   └── mockStorageService.js # ストレージモック
│   │
│   ├── graphql/               # GraphQL操作
│   │   ├── mutations.js
│   │   ├── queries.js
│   │   └── subscriptions.js
│   │
│   ├── config/                # 設定
│   │   ├── environment.js     # 環境設定
│   │   └── awsConfig.js       # AWS設定
│   │
│   ├── hooks/                 # カスタムフック
│   ├── lib/                   # ユーティリティ
│   ├── App.jsx                # ルートコンポーネント
│   ├── main.jsx               # エントリーポイント
│   └── index.css              # グローバルスタイル
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 主要機能

### 1. 認証システム

#### 新規登録フロー
1. メールアドレス・パスワード・名前を入力
2. 確認コード受信（Mock: `123456`）
3. 初回プロフィール設定
   - ユーザータイプ（ライダー/フォトグラファー）
   - ニックネーム・都道府県
   - バイク情報 or 撮影ジャンル
4. ホーム画面へ

#### ログイン
- メールアドレス・パスワードで認証
- セッション管理

### 2. フォトグラファー検索

- **検索フィルター**
  - 都道府県
  - 撮影ジャンル
  - キーワード検索

- **詳細表示**
  - プロフィール情報
  - ポートフォリオギャラリー
  - レビュー・評価
  - メッセージ送信

### 3. メッセージ機能

- リアルタイムチャット
- 画像・動画送信
- 既読管理
- 会話一覧

### 4. レビュー・評価

- 5段階評価
- コメント投稿
- 平均評価表示
- レビュー一覧

### 5. プロフィール管理

- プロフィール画像アップロード
- 基本情報編集
- バイク情報 / 撮影ジャンル
- 自己紹介

---

## 🔄 データフロー

### Mock環境でのデータ管理

```javascript
// localStorage構造
{
  "mockAuthData": {
    "currentUser": { userId, username, attributes },
    "isAuthenticated": true,
    "registeredUsers": { ... }
  },
  
  "mockAPIData": {
    "users": [...],
    "portfolios": [...],
    "conversations": [...],
    "messages": [...],
    "reviews": [...]
  },
  
  "mockStorageData": {
    "files": {
      "path/to/file": { data, contentType, uploadedAt }
    }
  }
}
```

### 認証フロー

```
1. ユーザー登録
   ↓
2. 確認コード入力
   ↓
3. プロフィール作成
   ↓
4. ホーム画面表示
```

---

## 🎯 使い方

### Mock環境での開発

1. **開発サーバー起動**
   ```bash
   npm run dev
   ```

2. **新規登録**
   - ホーム画面で「新規登録」をクリック
   - 情報を入力して登録
   - 確認コード: `123456`
   - プロフィール設定

3. **フォトグラファー検索**
   - ホーム画面で検索・フィルタリング
   - カードをクリックして詳細表示

4. **メッセージ送信**
   - フォトグラファー詳細で「メッセージを送る」
   - チャット画面で会話

5. **レビュー投稿**
   - メッセージ画面で「レビュー」ボタン
   - 評価とコメントを投稿

### デバッグ

Mock環境では、ブラウザの開発者ツールでlocalStorageを確認できます：

```javascript
// 認証データの確認
JSON.parse(localStorage.getItem('mockAuthData'))

// アプリデータの確認
JSON.parse(localStorage.getItem('mockAPIData'))

// ストレージデータの確認
JSON.parse(localStorage.getItem('mockStorageData'))
```

---

## 📝 GraphQL スキーマ

主要な型定義：

```graphql
type User {
  id: ID!
  email: String!
  nickname: String
  user_type: UserType
  prefecture: String
  bike_maker: String
  bike_model: String
  bio: String
  profile_image: String
  genres: [String]
}

type Portfolio {
  id: ID!
  photographer_id: ID!
  image_key: String!
  title: String
  description: String
}

type Conversation {
  id: ID!
  biker_id: ID!
  photographer_id: ID!
  last_message: String
  last_message_at: AWSDateTime
}

type Message {
  id: ID!
  conversationID: ID!
  sender_id: ID!
  content: String
  media_key: String
  is_read: Boolean
}

type Review {
  id: ID!
  reviewer_id: ID!
  reviewee_id: ID!
  rating: Int!
  comment: String
}
```

---

## 🚢 デプロイ

### AWS Amplify Hosting

```bash
# Amplify Hosting にデプロイ
amplify add hosting

# デプロイ実行
amplify publish
```

### その他のホスティングサービス

```bash
# ビルド
npm run build

# dist/ フォルダをデプロイ
# - Vercel
# - Netlify
# - CloudFlare Pages
# など
```

---

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

## 📮 お問い合わせ

プロジェクトに関する質問やフィードバックは、GitHubのIssuesでお願いします。

---

## 🙏 謝辞

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ for the motorcycle community

