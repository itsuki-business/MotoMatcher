# GitHubへのプッシュ手順

このガイドでは、BikeMatchプロジェクトをGitHubにプッシュする手順を説明します。

## 📋 前提条件

- GitHubアカウントを持っていること
- Gitがインストールされていること
- プロジェクトが既にGitリポジトリとして初期化されていること

---

## 🚀 手順

### 1. GitHubでリポジトリを作成

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. 以下を入力：
   - **Repository name**: `bikematch` (お好きな名前でOK)
   - **Description**: `バイク愛好家とフォトグラファーをマッチングするプラットフォーム`
   - **Public** または **Private** を選択
   - **Initialize this repository with** は全てチェックを外す（既にファイルがあるため）
4. 「Create repository」をクリック

### 2. ローカルでGitリポジトリを初期化（まだの場合）

```bash
# 現在のディレクトリで実行
git init
```

### 3. すべてのファイルをステージング

```bash
# すべてのファイルを追加
git add .
```

### 4. 初回コミット

```bash
git commit -m "feat: BikeMatchプロジェクトの初回コミット

- React + Vite ベースのプロジェクト構造
- Mock環境とAWS本番環境の両対応
- 認証、マッチング、メッセージ、レビュー機能
- レスポンシブUI実装
- 完全なドキュメントとセットアップガイド"
```

### 5. ブランチ名を変更（必要に応じて）

```bash
# メインブランチをmainに設定
git branch -M main
```

### 6. GitHubリポジトリをリモートに追加

GitHubで作成したリポジトリのURLを使用：

```bash
# HTTPSの場合
git remote add origin https://github.com/your-username/bikematch.git

# SSHの場合
git remote add origin git@github.com:your-username/bikematch.git
```

**注意**: `your-username` と `bikematch` を実際のユーザー名とリポジトリ名に置き換えてください。

### 7. プッシュ

```bash
git push -u origin main
```

初回は認証情報の入力を求められる場合があります。

---

## ✅ 確認

GitHubのリポジトリページで以下が表示されているか確認：

- ✅ README.md
- ✅ package.json
- ✅ src/ ディレクトリ
- ✅ amplify/ ディレクトリ
- ✅ その他のプロジェクトファイル

---

## 🔄 今後の更新方法

### 変更をコミット

```bash
# 変更を確認
git status

# ファイルをステージング
git add .

# コミット
git commit -m "feat: 機能の説明"

# プッシュ
git push
```

### コミットメッセージの規約

- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント
- `style:` - コードスタイル
- `refactor:` - リファクタリング
- `test:` - テスト
- `chore:` - その他

例：
```bash
git commit -m "feat: メッセージ送信機能に画像添付を追加"
git commit -m "fix: プロフィール画像の表示バグを修正"
git commit -m "docs: READMEにセットアップ手順を追加"
```

---

## 🔐 認証エラーの場合

### Personal Access Token の作成

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. 権限を選択：
   - `repo` (リポジトリへの完全アクセス)
4. トークンをコピー
5. プッシュ時にパスワードの代わりにトークンを入力

### SSH設定（推奨）

```bash
# SSHキーの生成（まだの場合）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 公開キーを表示
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys → New SSH key
# 上記の公開キーをコピー&ペーストして追加
```

---

## 📝 .gitignore の確認

重要な情報がコミットされないように、`.gitignore` が正しく設定されているか確認：

✅ 以下のファイルはコミットされません：
- `node_modules/`
- `.env` ファイル
- `dist/` ビルド成果物
- AWS設定ファイル（機密情報含む）

---

## 🌟 リポジトリの表示

GitHubでリポジトリを開くと、以下の情報が表示されます：

- **README.md**: プロジェクト概要
- **Topics**: プロジェクトにタグを追加（`react`, `bikematch`, `photography`, `matching` など）
- **About**: 説明とウェブサイトURL（あれば）

---

## 🔄 ブランチ戦略

### メインブランチ

- `main`: 本番環境用の安定版
- `develop`: 開発用ブランチ（オプション）

### 機能ブランチ

```bash
# 新しい機能を開発
git checkout -b feature/new-feature

# 開発後、プルリクエストを作成
git push -u origin feature/new-feature
```

---

## 📚 参考リンク

- [GitHub Docs](https://docs.github.com/)
- [Git公式ドキュメント](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Happy Coding! 🚀

