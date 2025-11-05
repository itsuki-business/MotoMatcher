// Mock認証サービス
// AWS Cognitoの動作を模倣

const MOCK_AUTH_KEY = 'mockAuthData';
const MOCK_PENDING_USER_KEY = 'mockPendingUser';
const MOCK_CURRENT_SESSION_KEY = 'mockCurrentSession';

// ランダムID生成（16文字）
const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 現在のセッションを取得（sessionStorageを使用してタブごとに独立）
const getCurrentSession = () => {
  try {
    const sessionData = sessionStorage.getItem(MOCK_CURRENT_SESSION_KEY);
    if (!sessionData) return null;
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

// セッションを保存（sessionStorageを使用してタブごとに独立）
const saveSession = (sessionData) => {
  try {
    sessionStorage.setItem(MOCK_CURRENT_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Save session error:', error);
  }
};

// セッションを削除
const removeSession = () => {
  try {
    sessionStorage.removeItem(MOCK_CURRENT_SESSION_KEY);
  } catch (error) {
    console.error('Remove session error:', error);
  }
};

export const mockAuthService = {
  // 新規登録
  signUp: async (email, password, name) => {
    try {
      // 既存ユーザーチェック
      const authData = JSON.parse(localStorage.getItem(MOCK_AUTH_KEY) || '{}');
      if (authData.registeredUsers && authData.registeredUsers[email]) {
        throw new Error('このメールアドレスは既に登録されています');
      }

      // 一時保存
      const pendingUser = {
        email,
        password,
        name,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem(MOCK_PENDING_USER_KEY, JSON.stringify(pendingUser));

      return {
        user: null,
        userConfirmed: false,
        userSub: null
      };
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  },

  // 確認コード送信
  confirmSignUp: async (email, code) => {
    try {
      const pendingUserStr = localStorage.getItem(MOCK_PENDING_USER_KEY);
      if (!pendingUserStr) {
        throw new Error('登録情報が見つかりません');
      }

      const pendingUser = JSON.parse(pendingUserStr);
      if (pendingUser.email !== email) {
        throw new Error('メールアドレスが一致しません');
      }

      // Mock環境では固定コード「123456」を受け入れる
      if (code !== '123456') {
        throw new Error('確認コードが正しくありません');
      }

      // ランダムID生成
      const generatedId = generateRandomId();

      // 認証データ保存
      const authData = JSON.parse(localStorage.getItem(MOCK_AUTH_KEY) || '{}');
      const registeredUsers = authData.registeredUsers || {};
      
      registeredUsers[email] = {
        userId: generatedId,
        generatedId: generatedId,
        email: pendingUser.email,
        password: pendingUser.password,
        name: pendingUser.name,
        confirmedAt: new Date().toISOString()
      };

      const newAuthData = {
        ...authData,
        registeredUsers
      };

      localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(newAuthData));
      localStorage.removeItem(MOCK_PENDING_USER_KEY);

      // 新しいセッションを作成（タブごとに独立）
      saveSession({
        userId: generatedId,
        generatedId: generatedId,
        username: email,
        attributes: {
          email: email,
          name: pendingUser.name,
          sub: generatedId
        },
        isAuthenticated: true,
        createdAt: new Date().toISOString()
      });

      return {
        success: true,
        userId: generatedId
      };
    } catch (error) {
      console.error('ConfirmSignUp error:', error);
      throw error;
    }
  },

  // ログイン
  signIn: async (email, password) => {
    try {
      const authData = JSON.parse(localStorage.getItem(MOCK_AUTH_KEY) || '{}');
      const registeredUsers = authData.registeredUsers || {};
      
      const user = registeredUsers[email];
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }

      if (user.password !== password) {
        throw new Error('パスワードが正しくありません');
      }

      // 新しいセッションを作成（タブごとに独立）
      saveSession({
        userId: user.userId,
        generatedId: user.generatedId,
        username: email,
        attributes: {
          email: email,
          name: user.name,
          sub: user.userId
        },
        isAuthenticated: true,
        createdAt: new Date().toISOString()
      });

      return {
        isSignedIn: true,
        nextStep: {
          signInStep: 'DONE'
        }
      };
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  },

  // ログアウト
  signOut: async () => {
    try {
      removeSession();
      return { success: true };
    } catch (error) {
      console.error('SignOut error:', error);
      throw error;
    }
  },

  // 現在のユーザー取得
  getCurrentUser: async () => {
    try {
      const session = getCurrentSession();
      if (!session || !session.isAuthenticated) {
        return null;
      }
      return {
        userId: session.userId,
        generatedId: session.generatedId,
        username: session.username,
        attributes: session.attributes,
        sub: session.userId
      };
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      return null;
    }
  },

  // 認証状態チェック
  checkAuthState: async () => {
    try {
      const session = getCurrentSession();
      if (!session || !session.isAuthenticated) {
        return {
          isAuthenticated: false,
          user: null
        };
      }
      return {
        isAuthenticated: true,
        user: {
          userId: session.userId,
          generatedId: session.generatedId,
          username: session.username,
          attributes: session.attributes
        }
      };
    } catch (error) {
      console.error('CheckAuthState error:', error);
      return {
        isAuthenticated: false,
        user: null
      };
    }
  },

  // パスワードリセット要求
  resetPassword: async (email) => {
    try {
      const authData = JSON.parse(localStorage.getItem(MOCK_AUTH_KEY) || '{}');
      const registeredUsers = authData.registeredUsers || {};
      
      if (!registeredUsers[email]) {
        throw new Error('ユーザーが見つかりません');
      }

      // Mock環境では実際にはメールを送信しない
      console.log('Password reset email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('ResetPassword error:', error);
      throw error;
    }
  },

  // パスワードリセット確認
  confirmResetPassword: async (email, code, newPassword) => {
    try {
      // Mock環境では固定コード「123456」を受け入れる
      if (code !== '123456') {
        throw new Error('確認コードが正しくありません');
      }

      const authData = JSON.parse(localStorage.getItem(MOCK_AUTH_KEY) || '{}');
      const registeredUsers = authData.registeredUsers || {};
      
      if (!registeredUsers[email]) {
        throw new Error('ユーザーが見つかりません');
      }

      registeredUsers[email].password = newPassword;
      localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(authData));

      return { success: true };
    } catch (error) {
      console.error('ConfirmResetPassword error:', error);
      throw error;
    }
  },

  // すべてのユーザーデータを削除（開発・テスト用）
  clearAllUsers: async () => {
    try {
      // 認証関連データを削除
      localStorage.removeItem(MOCK_AUTH_KEY);
      localStorage.removeItem(MOCK_PENDING_USER_KEY);
      
      // セッションを削除
      sessionStorage.removeItem(MOCK_CURRENT_SESSION_KEY);
      
      // アプリデータも削除（会話、メッセージ、ポートフォリオなど）
      localStorage.removeItem('mockAPIData');
      
      console.log('✅ すべてのユーザーデータを削除しました');
      return { success: true };
    } catch (error) {
      console.error('ClearAllUsers error:', error);
      throw error;
    }
  }
};
