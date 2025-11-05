import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prefectures, bikeMakers, photographyGenres } from '@/config/environment';
import { mockAuthService } from '@/services/mockAuthService';
import { mockAPIService } from '@/services/mockAPIService';
import { useMock } from '@/config/environment';
import * as mutations from '@/graphql/mutations';

export function FirstTimeProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: basic info, 2: confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    user_type: '',
    nickname: '',
    prefecture: '',
    bike_maker: '',
    bike_model: '',
    bio: '',
    genres: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const validateStep1 = () => {
    if (!formData.user_type) {
      setError('ユーザータイプを選択してください');
      return false;
    }
    if (!formData.nickname) {
      setError('ニックネームを入力してください');
      return false;
    }
    if (!formData.prefecture) {
      setError('都道府県を選択してください');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Get current user
      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }

      if (!currentUser) {
        throw new Error('ユーザー情報が取得できませんでした');
      }

      // Create user profile
      const userInput = {
        id: currentUser.userId || currentUser.sub,
        email: currentUser.username || currentUser.attributes?.email,
        ...formData
      };

      if (useMock) {
        await mockAPIService.mockCreateUser(userInput);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.createUser,
          variables: { input: userInput }
        });
      }

      // Navigate to home
      navigate('/home-for-register');
    } catch (err) {
      console.error('Create profile error:', err);
      setError(err.message || 'プロフィールの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 1 ? 'プロフィール設定' : '確認'}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {step === 1 
                ? 'BikeMatchを始めるために基本情報を入力してください' 
                : '入力内容を確認してください'}
            </p>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>ユーザータイプ *</Label>
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) => handleInputChange('user_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">ライダー（撮影依頼）</SelectItem>
                      <SelectItem value="photographer">フォトグラファー（撮影受注）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">ニックネーム *</Label>
                  <Input
                    id="nickname"
                    placeholder="山田太郎"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>都道府県 *</Label>
                  <Select
                    value={formData.prefecture}
                    onValueChange={(value) => handleInputChange('prefecture', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {prefectures.map((pref) => (
                        <SelectItem key={pref} value={pref}>
                          {pref}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.user_type === 'client' && (
                  <>
                    <div className="space-y-2">
                      <Label>バイクメーカー</Label>
                      <Select
                        value={formData.bike_maker}
                        onValueChange={(value) => handleInputChange('bike_maker', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {bikeMakers.map((maker) => (
                            <SelectItem key={maker} value={maker}>
                              {maker}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bike_model">バイクモデル</Label>
                      <Input
                        id="bike_model"
                        placeholder="例: CB400SF"
                        value={formData.bike_model}
                        onChange={(e) => handleInputChange('bike_model', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {formData.user_type === 'photographer' && (
                  <div className="space-y-2">
                    <Label>得意ジャンル</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {photographyGenres.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            formData.genres.includes(genre)
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">自己紹介</Label>
                  <Textarea
                    id="bio"
                    placeholder="あなたについて教えてください"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button onClick={handleNext} className="w-full" size="lg">
                  次へ
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">ユーザータイプ</div>
                    <div className="font-semibold">
                      {formData.user_type === 'client' ? 'ライダー' : 'フォトグラファー'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">ニックネーム</div>
                    <div className="font-semibold">{formData.nickname}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">都道府県</div>
                    <div className="font-semibold">{formData.prefecture}</div>
                  </div>
                  {formData.bike_maker && (
                    <div>
                      <div className="text-sm text-muted-foreground">バイク</div>
                      <div className="font-semibold">
                        {formData.bike_maker} {formData.bike_model}
                      </div>
                    </div>
                  )}
                  {formData.genres.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground">得意ジャンル</div>
                      <div className="font-semibold">{formData.genres.join(', ')}</div>
                    </div>
                  )}
                  {formData.bio && (
                    <div>
                      <div className="text-sm text-muted-foreground">自己紹介</div>
                      <div className="font-semibold">{formData.bio}</div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    disabled={loading}
                  >
                    戻る
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? '作成中...' : '完了'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

