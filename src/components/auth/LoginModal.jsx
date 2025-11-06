import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockAuthService } from '@/services/mockAuthService';
import { useMock } from '@/config/environment';

export function LoginModal({ isOpen, onClose, onSuccess, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useMock) {
        await mockAuthService.signIn(email, password);
      } else {
        // AWS Cognito implementation
        const { signIn } = await import('aws-amplify/auth');
        await signIn({ username: email, password });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
          <DialogDescription>
            MotoMatcherにログインして、フォトグラファーとつながりましょう
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>

        <div className="space-y-3 text-center text-sm text-muted-foreground">
          <p>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                handleClose();
                onForgotPassword?.();
              }}
            >
              パスワードを忘れてしまった方へ
            </button>
          </p>
          <p>
            アカウントをお持ちでない方は
            <button
              type="button"
              className="text-primary hover:underline ml-1"
              onClick={handleClose}
            >
              新規登録
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

