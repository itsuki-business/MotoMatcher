# コントリビューションガイド

BikeMatchプロジェクトへの貢献をありがとうございます！

## 🚀 始める前に

1. GitHubでリポジトリをフォーク
2. ローカルにクローン：
   ```bash
   git clone https://github.com/your-username/bikematch.git
   cd bikematch
   ```

## 🔧 開発環境のセットアップ

詳細は [SETUP.md](SETUP.md) を参照してください。

```bash
npm install
npm run dev
```

## 📝 開発フロー

1. **ブランチの作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **変更をコミット**
   ```bash
   git add .
   git commit -m "feat: 機能の説明"
   ```

3. **プッシュ**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **プルリクエストを作成**
   - GitHubでプルリクエストを作成
   - 変更内容を詳しく説明

## 📋 コミットメッセージの規約

[Conventional Commits](https://www.conventionalcommits.org/) に従います：

- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント変更
- `style:` - コードスタイル（フォーマットなど）
- `refactor:` - リファクタリング
- `test:` - テスト追加・修正
- `chore:` - ビルドプロセスやツールの変更

例：
```bash
git commit -m "feat: メッセージ送信機能に画像添付を追加"
git commit -m "fix: プロフィール画像の表示バグを修正"
git commit -m "docs: READMEにセットアップ手順を追加"
```

## 🎨 コードスタイル

- ESLint/Prettierの設定に従う（今後追加予定）
- コンポーネントは関数コンポーネントを使用
- TypeScriptの利用を推奨（今後移行予定）

## ✅ プルリクエストのチェックリスト

- [ ] コードが動作することを確認
- [ ] 新しい機能には適切なコメントを追加
- [ ] READMEやドキュメントを更新（必要に応じて）
- [ ] コミットメッセージが規約に従っている
- [ ] 既存のテストが通る（今後追加予定）

## 🐛 バグ報告

GitHub Issuesで以下の情報を含めて報告してください：

- バグの説明
- 再現手順
- 期待される動作
- 実際の動作
- スクリーンショット（可能であれば）
- 環境情報（OS、ブラウザなど）

## 💡 機能提案

GitHub Issuesで機能提案をしてください：

- 機能の概要
- なぜその機能が必要か
- 実装方法の提案（可能であれば）

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

質問や提案がある場合は、お気軽にGitHub Issuesでお知らせください！

