# BikeMatch セットアップガイド

このガイドでは、BikeMatchプロジェクトのセットアップ手順を詳しく説明します。

---

## 目次

1. [開発環境のセットアップ](#開発環境のセットアップ)
2. [Mock環境での開発](#mock環境での開発)
3. [AWS本番環境のセットアップ](#aws本番環境のセットアップ)
4. [トラブルシューティング](#トラブルシューティング)

---

## 開発環境のセットアップ

### 必要要件

- **Node.js**: 18.x 以上
- **npm**: 9.x 以上 または **yarn**: 1.22.x 以上
- **Git**: 最新版

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/bikematch.git
cd bikematch
```

### 2. 依存パッケージのインストール

```bash
npm install
```

または

```bash
yarn install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

---

## Mock環境での開発

Mock環境は、AWSサービスなしでアプリケーションを開発・テストできる環境です。

### 特徴

- ✅ AWSアカウント不要
- ✅ インターネット接続不要（オフライン開発可能）
- ✅ データはlocalStorageに保存
- ✅ 即座に開発開始可能

### 設定

`src/config/environment.js` で以下の設定を確認：

```javascript
export const useMock = true; // Mock環境を使用
```

### Mock環境での機能

#### 認証

- **確認コード**: 固定値 `123456`
- **ログイン**: 登録したメールアドレスとパスワード
- **セッション**: localStorageで管理

#### データ保存

すべてのデータは以下のキーでlocalStorageに保存されます：

- `mockAuthData`: 認証情報
- `mockAPIData`: アプリケーションデータ
- `mockStorageData`: ファイル（Base64エンコード）

#### デバッグ

開発者ツールのコンソールで以下のコマンドを実行：

```javascript
// 認証データを表示
console.log(JSON.parse(localStorage.getItem('mockAuthData')));

// アプリデータを表示
console.log(JSON.parse(localStorage.getItem('mockAPIData')));

// データをクリア（リセット）
localStorage.clear();
```

### テストユーザーの作成

1. ブラウザで `http://localhost:3000` を開く
2. 「新規登録」をクリック
3. 以下の情報を入力：
   - 名前: `テストユーザー`
   - メール: `test@example.com`
   - パスワード: `Test1234`
   - パスワード確認: `Test1234`
4. 確認コード: `123456`
5. プロフィール設定：
   - ユーザータイプ: `フォトグラファー`
   - ニックネーム: `テストフォトグラファー`
   - 都道府県: `東京都`
   - 得意ジャンル: 適宜選択

---

## AWS本番環境のセットアップ

### 前提条件

- AWSアカウント
- AWS CLI の設定済み
- Amplify CLI のインストール

### 1. Amplify CLI のインストール

```bash
npm install -g @aws-amplify/cli
```

### 2. AWS認証情報の設定

```bash
amplify configure
```

表示される指示に従って：
1. AWSコンソールにサインイン
2. IAMユーザーを作成
3. アクセスキーとシークレットキーを取得
4. Amplify CLIに設定

### 3. Amplifyプロジェクトの初期化

```bash
amplify init
```

以下の情報を入力：

```
? Enter a name for the project: bikematch
? Initialize the project with the above configuration? Yes
? Select the authentication method you want to use: AWS profile
? Please choose the profile you want to use: default
```

### 4. 認証（Cognito）の追加

```bash
amplify add auth
```

設定：

```
? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Email
? Do you want to configure advanced settings? No, I am done.
```

### 5. API（AppSync）の追加

```bash
amplify add api
```

設定：

```
? Select from one of the below mentioned services: GraphQL
? Here is the GraphQL API that we will create. Select a setting to edit or continue: Continue
? Choose a schema template: Single object with fields
```

スキーマファイルを編集：

```bash
code amplify/backend/api/bikematch/schema.graphql
```

`amplify/backend/api/bikematch/schema.graphql` の内容を、
プロジェクトの `amplify/backend/api/bikematch/schema.graphql` で置き換えます。

### 6. ストレージ（S3）の追加

```bash
amplify add storage
```

設定：

```
? Select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Provide a friendly name for your resource: bikematchstorage
? Provide bucket name: bikematchstorage<unique-id>
? Who should have access: Auth users only
? What kind of access do you want for Authenticated users? create, read, update, delete
? Do you want to add a Lambda Trigger for your S3 Bucket? No
```

### 7. バックエンドのデプロイ

```bash
amplify push
```

確認画面で `Yes` を選択。デプロイには数分かかります。

### 8. 環境変数の設定

デプロイ完了後、以下のコマンドで設定情報を確認：

```bash
amplify status
```

`.env` ファイルを作成：

```bash
cp .env.example .env
```

`.env` を編集して、Amplifyから取得した値を設定：

```env
# Cognito User Pool
VITE_USER_POOL_ID=ap-northeast-1_XXXXXXXXX
VITE_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_IDENTITY_POOL_ID=ap-northeast-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# AppSync GraphQL API
VITE_GRAPHQL_ENDPOINT=https://XXXXXXXXXX.appsync-api.ap-northeast-1.amazonaws.com/graphql

# S3 Storage
VITE_S3_BUCKET=bikematchstorage-XXXXXX

# Mock環境を無効化
VITE_USE_MOCK=false
```

### 9. 本番環境に切り替え

`src/config/environment.js` を編集：

```javascript
export const useMock = false; // 本番環境を使用
```

### 10. 動作確認

```bash
npm run dev
```

本番環境でアプリケーションが動作することを確認します。

---

## トラブルシューティング

### Mock環境

#### 問題: データが保存されない

**解決策:**
- ブラウザのプライベートモードを使用している場合、通常モードで開いてください
- localStorageが無効化されていないか確認してください

#### 問題: 確認コードが受け付けられない

**解決策:**
- Mock環境では固定値 `123456` を入力してください

#### 問題: 画像が表示されない

**解決策:**
- 開発者ツールのコンソールでエラーを確認してください
- localStorageの容量制限（通常5-10MB）に達している可能性があります
- `localStorage.clear()` でデータをクリアしてください

### AWS本番環境

#### 問題: Amplify push が失敗する

**解決策:**
```bash
# キャッシュをクリア
amplify env remove <env-name>
amplify env add <env-name>

# 再度プッシュ
amplify push
```

#### 問題: 認証エラーが発生する

**解決策:**
- `.env` ファイルの設定値が正しいか確認
- Cognitoのユーザープールで設定を確認
- アプリクライアントのシークレットが必要ない設定になっているか確認

#### 問題: GraphQL API エラー

**解決策:**
```bash
# API の状態を確認
amplify status

# API を更新
amplify update api
amplify push
```

#### 問題: S3アップロードエラー

**解決策:**
- S3バケットのCORS設定を確認
- IAMロールの権限を確認
- ファイルサイズ制限を確認（デフォルト: 5MB）

### ビルドエラー

#### 問題: npm install で失敗する

**解決策:**
```bash
# キャッシュをクリア
npm cache clean --force

# node_modules を削除
rm -rf node_modules package-lock.json

# 再インストール
npm install
```

#### 問題: Viteビルドエラー

**解決策:**
```bash
# キャッシュをクリア
rm -rf node_modules/.vite

# 再ビルド
npm run build
```

---

## ヒントとベストプラクティス

### 開発フロー

1. **Mock環境で開発**
   - 機能の実装とテスト
   - UI/UXの調整

2. **本番環境でテスト**
   - AWS環境での動作確認
   - パフォーマンステスト

3. **デプロイ**
   - Amplify Hosting または他のサービス

### デバッグ

#### React DevTools

```bash
# Chrome拡張機能をインストール
https://chrome.google.com/webstore/detail/react-developer-tools
```

#### TanStack Query DevTools

コンポーネントに追加：

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      {/* ... */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

---

## 次のステップ

- [README.md](README.md) でプロジェクト概要を確認
- [GraphQLスキーマ](amplify/backend/api/bikematch/schema.graphql) を確認
- [コンポーネント](src/components) のコードを確認
- [Issues](https://github.com/your-username/bikematch/issues) で機能追加や改善を提案

---

Happy Coding! 🚀

