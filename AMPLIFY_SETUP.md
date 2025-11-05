# Amplify セットアップガイド

## 前提条件

- Node.js 18.x 以上
- AWS アカウント
- AWS CLI インストール済み

## 1. Amplify CLI のインストール

```bash
npm install -g @aws-amplify/cli
```

## 2. AWS 認証情報の設定

```bash
amplify configure
```

以下の手順で設定：
1. AWS コンソールにサインイン
2. リージョン選択: `ap-northeast-1` (東京)
3. IAM ユーザー作成
4. アクセスキーとシークレットキーを入力

## 3. Amplify プロジェクトの初期化

```bash
amplify init
```

設定例：
```
? Enter a name for the project: motomatcher
? Initialize the project with the above configuration? No
? Enter a name for the environment: dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react
? Source Directory Path: src
? Distribution Directory Path: dist
? Build Command: npm run build
? Start Command: npm run dev
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use: default
```

## 4. バックエンドリソースのデプロイ

```bash
amplify push
```

確認プロンプト：
```
? Are you sure you want to continue? Yes
? Do you want to generate code for your newly created GraphQL API? No
```

デプロイには5-10分かかります。

## 5. 環境変数の設定

デプロイ完了後、以下のコマンドで設定値を確認：

```bash
amplify status
```

`src/aws-exports.js` が自動生成されます。

または `.env` ファイルを作成：

```bash
cp .env.example .env
```

`.env` ファイルを編集して、以下の値を設定：

```env
VITE_USER_POOL_ID=ap-northeast-1_XXXXXXXXX
VITE_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_IDENTITY_POOL_ID=ap-northeast-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
VITE_GRAPHQL_ENDPOINT=https://XXXXXXXXXXXXXXXXXXXXXXXXXX.appsync-api.ap-northeast-1.amazonaws.com/graphql
VITE_S3_BUCKET=motomatcher-storage-XXXXXX-dev
VITE_AWS_REGION=ap-northeast-1
```

## 6. Mock環境からAWS環境への切り替え

`src/config/environment.js` を編集：

```javascript
export const useMock = false; // true → false に変更
```

## 7. 開発サーバーの起動

```bash
npm run dev
```

## 8. ホスティング（オプション）

Amplify Hosting を使用する場合：

```bash
amplify add hosting
```

選択肢：
```
? Select the plugin module to execute: Hosting with Amplify Console
? Choose a type: Manual deployment
```

デプロイ：

```bash
amplify publish
```

## トラブルシューティング

### GraphQL スキーマエラー

スキーマを変更した場合：

```bash
amplify api gql-compile
amplify push
```

### 認証エラー

Cognito設定を確認：

```bash
amplify auth update
amplify push
```

### ストレージエラー

S3バケットのアクセス権限を確認：

```bash
amplify storage update
amplify push
```

## リソースの削除

全てのAWSリソースを削除する場合：

```bash
amplify delete
```

## 主要なAmplifyコマンド

```bash
# 現在の状態確認
amplify status

# リソース追加
amplify add <category>

# リソース更新
amplify update <category>

# リソース削除
amplify remove <category>

# バックエンドデプロイ
amplify push

# コンソールを開く
amplify console

# ログ確認
amplify console api
amplify console auth
amplify console storage
```

## GraphQL API テスト

AWS AppSync コンソールでクエリをテスト：

```bash
amplify console api
```

または、ローカルでテスト：

```graphql
query ListUsers {
  listUsers {
    items {
      id
      nickname
      user_type
      prefecture
    }
  }
}
```

## S3 ストレージ使用例

```javascript
import { uploadData, getUrl } from 'aws-amplify/storage';

// アップロード
const result = await uploadData({
  key: 'profile/image.jpg',
  data: file,
  options: {
    contentType: 'image/jpeg'
  }
}).result;

// URL取得
const url = await getUrl({
  key: 'profile/image.jpg'
});
```

## 参考リンク

- [Amplify Documentation](https://docs.amplify.aws/)
- [AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [Cognito Documentation](https://docs.aws.amazon.com/cognito/)
