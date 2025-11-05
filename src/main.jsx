import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { mockAuthService } from './services/mockAuthService'
import { useMock } from './config/environment'

// AWS Amplify初期化（本番環境）
if (!useMock) {
  const { Amplify } = await import('aws-amplify')
  const awsconfig = await import('./aws-exports')
  Amplify.configure(awsconfig.default)
}

// 開発者用：コンソールからすべてのユーザーデータを削除できる関数
if (useMock && import.meta.env.DEV) {
  window.clearAllUsers = async () => {
    if (window.confirm('すべてのユーザーデータを削除しますか？\n（ログインデータ、登録済みユーザー、セッションなどすべてが削除されます）')) {
      try {
        await mockAuthService.clearAllUsers();
        alert('✅ すべてのユーザーデータを削除しました！\nページをリロードしてください。');
        window.location.reload();
      } catch (error) {
        alert('❌ エラーが発生しました: ' + error.message);
      }
    }
  };
  console.log('🛠️ 開発者ツール: コンソールで clearAllUsers() を実行すると、すべてのユーザーデータを削除できます');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
