import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockAuthService } from '@/services/mockAuthService';
import { useMock } from '@/config/environment';

export function RegisterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // 'register' or 'confirm'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    user_type: ''
  });
  const [confirmCode, setConfirmCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.user_type) {
      setError('ユーザータイプを選択してください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    setLoading(true);

    try {
      if (useMock) {
        await mockAuthService.signUp(formData.email, formData.password, formData.name);
      } else {
        // AWS Cognito implementation
        const { signUp } = await import('aws-amplify/auth');
        const result = await signUp({
          username: formData.email,
          password: formData.password,
          options: {
            userAttributes: {
              email: formData.email,
              name: formData.name
            }
          }
        });
        console.log('SignUp result:', result);
      }

      setStep('confirm');
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useMock) {
        await mockAuthService.confirmSignUp(formData.email, confirmCode);
      } else {
        // AWS Cognito implementation
        const { confirmSignUp, signIn } = await import('aws-amplify/auth');
        
        // 確認
        await confirmSignUp({
          username: formData.email,
          confirmationCode: confirmCode
        });
        
        // 自動ログイン
        await signIn({
          username: formData.email,
          password: formData.password
        });
        
        // セッション確立を待つ
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // プロフィール自動作成
        const { getCurrentUser } = await import('aws-amplify/auth');
        const currentUser = await getCurrentUser();
        console.log('Current user:', currentUser);
        
        const userId = currentUser.userId || currentUser.sub;
        console.log('User ID for profile:', userId);
        
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        
        try {
          const { createUser } = await import('@/graphql/mutations');
          const createResult = await client.graphql({
            query: createUser,
            variables: {
              input: {
                id: userId,
                email: formData.email,
                nickname: formData.name,
                user_type: formData.user_type
              }
            }
          });
          console.log('Profile created:', createResult);
        } catch (createError) {
          console.error('Create profile error:', createError);
          console.error('Error details:', JSON.stringify(createError, null, 2));
          if (createError.errors && createError.errors.length > 0) {
            console.error('GraphQL errors:', createError.errors);
            alert('プロフィール作成に失敗しました: ' + createError.errors[0].message);
          } else {
            alert('プロフィール作成に失敗しました: ' + (createError.message || '不明なエラー'));
          }
        }
      }

      // ログイン成功後はホーム画面へ
      handleClose();
      window.location.href = '/home-for-register';
    } catch (err) {
      console.error('Confirm error:', err);
      setError(err.message || '確認に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('register');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      user_type: ''
    });
    setConfirmCode('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'register' ? (
          <>
            <DialogHeader>
              <DialogTitle>新規登録</DialogTitle>
              <DialogDescription>
                MotoMatcherに登録して、フォトグラファーを見つけましょう。
                登録後、プロフィールはいつでも設定できます。
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="山田太郎"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>ユーザータイプ *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('user_type', 'client')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      formData.user_type === 'client'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-semibold">ライダー</div>
                    <div className="text-xs mt-1">撮影依頼</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('user_type', 'photographer')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      formData.user_type === 'photographer'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-semibold">フォトグラファー</div>
                    <div className="text-xs mt-1">撮影受注</div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">メールアドレス</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">パスワード</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="8文字以上"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">パスワード（確認）</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="再度入力してください"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '登録中...' : '登録'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>確認コードの入力</DialogTitle>
              <DialogDescription>
                {formData.email} に送信された確認コードを入力してください
                {useMock && (
                  <span className="block mt-2 text-primary font-semibold">
                    Mock環境：確認コードは「123456」です
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirm-code">確認コード</Label>
                <Input
                  id="confirm-code"
                  type="text"
                  placeholder="123456"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                  required
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('register')}
                  disabled={loading}
                >
                  戻る
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? '確認中...' : '確認'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

