import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Save, Instagram, Twitter, Globe, DollarSign } from 'lucide-react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { prefectures, bikeMakers, photographyGenres } from '@/config/environment';
import { mockAuthService } from '@/services/mockAuthService';
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';

export function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    user_type: '',
    prefecture: '',
    bike_maker: '',
    bike_model: '',
    bio: '',
    genres: [],
    profile_image: '',
    instagram_url: '',
    twitter_url: '',
    website_url: '',
    minimum_rate: '',
    rate_details: ''
  });

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }

      const targetUserId = userId || currentUser?.userId || currentUser?.sub;

      let userData;
      if (useMock) {
        userData = await mockAPIService.mockGetUser(targetUserId);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: queries.getUser,
          variables: { id: targetUserId }
        });
        userData = result.data.getUser;
      }

      if (userData) {
        setIsNewUser(false);
        setFormData({
          name: userData.name || '',
          user_type: userData.user_type || '',
          prefecture: userData.prefecture || '',
          bike_maker: userData.bike_maker || '',
          bike_model: userData.bike_model || '',
          bio: userData.bio || '',
          genres: userData.genres || [],
          profile_image: userData.profile_image || '',
          instagram_url: userData.instagram_url || '',
          twitter_url: userData.twitter_url || '',
          website_url: userData.website_url || '',
          minimum_rate: userData.minimum_rate || '',
          rate_details: userData.rate_details || ''
        });

        // Load profile image
        if (userData.profile_image) {
          if (useMock) {
            const url = await mockStorageService.getImageUrl(userData.profile_image);
            setProfileImageUrl(url);
          } else {
            const { getUrl } = await import('aws-amplify/storage');
            const result = await getUrl({ key: userData.profile_image });
            setProfileImageUrl(result.url.href);
          }
        }
      } else {
        setIsNewUser(true);
      }
    } catch (err) {
      console.error('Load profile error:', err);
      setIsNewUser(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      setError('');

      let imageKey;
      if (useMock) {
        imageKey = await mockStorageService.uploadImage(file, 'profile-images');
        const url = await mockStorageService.getImageUrl(imageKey);
        setProfileImageUrl(url);
      } else {
        const { uploadData } = await import('aws-amplify/storage');
        const result = await uploadData({
          key: `profile-images/${Date.now()}_${file.name}`,
          data: file,
          options: {
            contentType: file.type
          }
        });
        imageKey = result.key;
        
        const { getUrl } = await import('aws-amplify/storage');
        const urlResult = await getUrl({ key: imageKey });
        setProfileImageUrl(urlResult.url.href);
      }

      setFormData(prev => ({ ...prev, profile_image: imageKey }));
    } catch (err) {
      console.error('Upload image error:', err);
      setError('画像のアップロードに失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }

      const targetUserId = userId || currentUser?.userId || currentUser?.sub;

      const input = {
        id: targetUserId,
        email: currentUser.username || currentUser.attributes?.email,
        ...formData,
        minimum_rate: formData.minimum_rate ? parseInt(formData.minimum_rate) : null
      };

      if (isNewUser) {
        if (useMock) {
          await mockAPIService.mockCreateUser(input);
        } else {
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          await client.graphql({
            query: mutations.createUser,
            variables: { input }
          });
        }
        setIsNewUser(false);
        setSuccess('プロフィールを作成しました');
      } else {
        if (useMock) {
          await mockAPIService.mockUpdateUser(input);
        } else {
          const { generateClient } = await import('aws-amplify/api');
          const client = generateClient();
          await client.graphql({
            query: mutations.updateUser,
            variables: { input }
          });
        }
        setSuccess('プロフィールを更新しました');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError('プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{isNewUser ? 'プロフィール作成' : 'プロフィール編集'}</CardTitle>
            {isNewUser && (
              <p className="text-sm text-muted-foreground mt-2">
                プロフィールを設定して、サービスを利用しましょう
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImageUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {formData.name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profile-image').click()}
                    disabled={saving}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    画像を変更
                  </Button>
                </div>
              </div>

              {/* User ID Display */}
              <div className="space-y-2">
                <Label>個人 ID</Label>
                <Input
                  value={userId || '読み込み中...'}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  このIDはCognitoで管理されています
                </p>
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
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

              {/* Client-specific fields */}
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
                      value={formData.bike_model}
                      onChange={(e) => handleInputChange('bike_model', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Photographer-specific fields */}
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

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">自己紹介</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>

              {/* External Portfolio URLs - Only for photographers */}
              {formData.user_type === 'photographer' && (
                <div className="space-y-4 border-t pt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">外部ポートフォリオ</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Instagram、Twitter、個人サイトなどのURLを設定できます
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram_url">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram URL
                      </div>
                    </Label>
                    <Input
                      id="instagram_url"
                      type="url"
                      placeholder="https://www.instagram.com/youraccount"
                      value={formData.instagram_url}
                      onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter_url">
                      <div className="flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        Twitter (X) URL
                      </div>
                    </Label>
                    <Input
                      id="twitter_url"
                      type="url"
                      placeholder="https://twitter.com/youraccount"
                      value={formData.twitter_url}
                      onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_url">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        ウェブサイト URL
                      </div>
                    </Label>
                    <Input
                      id="website_url"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Rate Information - Only for photographers */}
              {formData.user_type === 'photographer' && (
                <div className="space-y-4 border-t pt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">料金情報</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      最低料金と料金詳細を設定できます
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimum_rate">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        最低料金（1時間あたり）
                      </div>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="minimum_rate"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="5000"
                        value={formData.minimum_rate}
                        onChange={(e) => handleInputChange('minimum_rate', e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">円〜 / 1時間</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ※ 目安となる最低料金を入力してください
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate_details">
                      料金詳細
                    </Label>
                    <Textarea
                      id="rate_details"
                      placeholder="上記は目安です。土日は2時間15,000円〜、交通費は別途頂戴します。まずはお気軽にご相談ください。"
                      value={formData.rate_details}
                      onChange={(e) => handleInputChange('rate_details', e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      ※ 料金に関する詳細や条件を自由に記入してください
                    </p>
                  </div>
                </div>
              )}

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

              <div className="flex gap-3">
                {!isNewUser && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? (isNewUser ? '作成中...' : '保存中...') : (isNewUser ? '作成' : '保存')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

