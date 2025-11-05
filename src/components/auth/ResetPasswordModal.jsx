import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockAuthService } from '@/services/mockAuthService';
import { useMock } from '@/config/environment';

export function ResetPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState('request'); // 'request' or 'confirm'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (useMock) {
        // モックの場合は確認コードを生成して保存
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`reset_code_${email}`, code);
        console.log('パスワード再設定コード:', code);
        setSuccess(`確認コードを ${email} に送信しました（モック環境では: ${code}）`);
      } else {
        // AWS Cognito implementation
        const { resetPassword } = await import('aws-amplify/auth');
        await resetPassword({ username: email });
        setSuccess(`確認コードを ${email} に送信しました`);
      }
      
      setTimeout(() => {
        setStep('confirm');
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.message || 'パスワード再設定のリクエストに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    setLoading(true);

    try {
      if (useMock) {
        // モックの場合は確認コードを検証
        const savedCode = localStorage.getItem(`reset_code_${email}`);
        if (savedCode !== code) {
          throw new Error('確認コードが正しくありません');
        }
        
        // パスワードを更新
        const authData = JSON.parse(localStorage.getItem('mockAuthData') || '{}');
        const registeredUsers = authData.registeredUsers || {};
        if (registeredUsers[email]) {
          registeredUsers[email].password = newPassword;
          authData.registeredUsers = registeredUsers;
          localStorage.setItem('mockAuthData', JSON.stringify(authData));
        }
        
        localStorage.removeItem(`reset_code_${email}`);
        setSuccess('パスワードを再設定しました');
      } else {
        // AWS Cognito implementation
        const { confirmResetPassword } = await import('aws-amplify/auth');
        await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword: newPassword
        });
        setSuccess('パスワードを再設定しました');
      }

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Password reset confirm error:', err);
      setError(err.message || 'パスワードの再設定に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('request');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  const handleBackToRequest = () => {
    setStep('request');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>パスワードを再設定</DialogTitle>
          <DialogDescription>
            {step === 'request' 
              ? 'メールアドレスを入力して確認コードを受け取ってください' 
              : '確認コードと新しいパスワードを入力してください'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">メールアドレス</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                {success}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? '送信中...' : '確認コードを送信'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-code">確認コード</Label>
              <Input
                id="reset-code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">新しいパスワード</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">パスワード確認</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                {success}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBackToRequest}
                disabled={loading}
              >
                戻る
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? '再設定中...' : 'パスワードを再設定'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

