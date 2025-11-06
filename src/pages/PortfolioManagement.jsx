import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Trash2, Plus, Image as ImageIcon, Instagram, Twitter, Globe, Save, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockAuthService } from '@/services/mockAuthService';
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';

export function PortfolioManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    file: null,
    preview: null
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [externalUrls, setExternalUrls] = useState({
    instagram_url: '',
    twitter_url: '',
    website_url: ''
  });
  const [savingUrls, setSavingUrls] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get current user
      let user;
      if (useMock) {
        user = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        user = await getCurrentUser();
      }

      if (!user) {
        navigate('/home-for-non-register');
        return;
      }

      setCurrentUser(user);
      const userId = user.userId || user.sub;

      // Get app user data
      let userData;
      if (useMock) {
        userData = await mockAPIService.mockGetUser(userId);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: queries.getUser,
          variables: { id: userId }
        });
        userData = result.data.getUser;
      }

      setAppUser(userData);

      // フォトグラファーでない場合はリダイレクト
      if (userData?.user_type !== 'photographer') {
        navigate('/home-for-register');
        return;
      }

      // Load external URLs
      setExternalUrls({
        instagram_url: userData.instagram_url || '',
        twitter_url: userData.twitter_url || '',
        website_url: userData.website_url || ''
      });

      // Load portfolios
      await loadPortfolios(userId);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolios = async (userId) => {
    try {
      let portfolioList;
      if (useMock) {
        const result = await mockAPIService.mockListPortfolios(userId);
        portfolioList = result.items;
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const result = await client.graphql({
          query: queries.listPortfolios,
          variables: { photographer_id: userId }
        });
        portfolioList = result.data.listPortfolios.items;
      }

      // Load image URLs
      const portfoliosWithUrls = await Promise.all(
        portfolioList.map(async (portfolio) => {
          let imageUrl = null;
          if (portfolio.image_key) {
            if (useMock) {
              imageUrl = await mockStorageService.getImageUrl(portfolio.image_key);
            } else {
              const { getUrl } = await import('aws-amplify/storage');
              const result = await getUrl({ path: portfolio.image_key });
              imageUrl = result.url.href;
            }
          }
          return { ...portfolio, imageUrl };
        })
      );

      setPortfolios(portfoliosWithUrls);
    } catch (error) {
      console.error('Load portfolios error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPortfolio(prev => ({
          ...prev,
          file: file,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolio = async () => {
    if (!newPortfolio.file) {
      alert('画像を選択してください');
      return;
    }

    setUploading(true);

    try {
      const userId = currentUser.userId || currentUser.sub;

      // Upload image
      let imageKey;
      if (useMock) {
        imageKey = await mockStorageService.uploadImage(newPortfolio.file, 'portfolio');
      } else {
        const { uploadData } = await import('aws-amplify/storage');
        const result = await uploadData({
          key: `portfolio/${userId}/${Date.now()}_${newPortfolio.file.name}`,
          data: newPortfolio.file,
          options: {
            contentType: newPortfolio.file.type
          }
        });
        imageKey = result.key;
      }

      // Create portfolio
      const portfolioInput = {
        photographer_id: userId,
        image_key: imageKey,
        title: newPortfolio.title || null,
        description: newPortfolio.description || null
      };

      if (useMock) {
        await mockAPIService.mockCreatePortfolio(portfolioInput);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.createPortfolio,
          variables: { input: portfolioInput }
        });
      }

      // Reload portfolios
      await loadPortfolios(userId);

      // Reset form
      setNewPortfolio({
        title: '',
        description: '',
        file: null,
        preview: null
      });
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Add portfolio error:', error);
      alert('ポートフォリオの追加に失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePortfolio = async (portfolio) => {
    if (!confirm('この作品を削除しますか？')) {
      return;
    }

    try {
      // Delete from storage
      if (useMock) {
        await mockStorageService.remove({ key: portfolio.image_key });
      } else {
        const { remove } = await import('aws-amplify/storage');
        await remove({ key: portfolio.image_key });
      }

      // Delete portfolio record
      if (useMock) {
        await mockAPIService.mockDeletePortfolio(portfolio.id);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.deletePortfolio,
          variables: { input: { id: portfolio.id } }
        });
      }

      // Reload portfolios
      const userId = currentUser.userId || currentUser.sub;
      await loadPortfolios(userId);
    } catch (error) {
      console.error('Delete portfolio error:', error);
      alert('削除に失敗しました');
    }
  };

  const handleSaveExternalUrls = async () => {
    setSavingUrls(true);
    try {
      const userId = currentUser.userId || currentUser.sub;
      const updateInput = {
        id: userId,
        instagram_url: externalUrls.instagram_url || null,
        twitter_url: externalUrls.twitter_url || null,
        website_url: externalUrls.website_url || null
      };

      if (useMock) {
        await mockAPIService.mockUpdateUser(updateInput);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        await client.graphql({
          query: mutations.updateUser,
          variables: { input: updateInput }
        });
      }

      alert('外部ポートフォリオURLを保存しました');
    } catch (error) {
      console.error('Save external URLs error:', error);
      alert('保存に失敗しました');
    } finally {
      setSavingUrls(false);
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
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* External Portfolio URLs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>外部ポートフォリオ</CardTitle>
              <CardDescription>
                Instagram、Twitter、個人サイトなどのURLを設定できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url_portfolio">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram URL
                    </div>
                  </Label>
                  <Input
                    id="instagram_url_portfolio"
                    type="url"
                    placeholder="https://www.instagram.com/youraccount"
                    value={externalUrls.instagram_url}
                    onChange={(e) => setExternalUrls(prev => ({ ...prev, instagram_url: e.target.value }))}
                    disabled={savingUrls}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url_portfolio">
                    <div className="flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      Twitter (X) URL
                    </div>
                  </Label>
                  <Input
                    id="twitter_url_portfolio"
                    type="url"
                    placeholder="https://twitter.com/youraccount"
                    value={externalUrls.twitter_url}
                    onChange={(e) => setExternalUrls(prev => ({ ...prev, twitter_url: e.target.value }))}
                    disabled={savingUrls}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url_portfolio">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      ウェブサイト URL
                    </div>
                  </Label>
                  <Input
                    id="website_url_portfolio"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={externalUrls.website_url}
                    onChange={(e) => setExternalUrls(prev => ({ ...prev, website_url: e.target.value }))}
                    disabled={savingUrls}
                  />
                </div>
              </div>

              {/* Preview of External Links */}
              {(externalUrls.instagram_url || externalUrls.twitter_url || externalUrls.website_url) && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-3">プレビュー：</p>
                  <div className="flex flex-wrap gap-3">
                    {externalUrls.instagram_url && (
                      <a
                        href={externalUrls.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {externalUrls.twitter_url && (
                      <a
                        href={externalUrls.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {externalUrls.website_url && (
                      <a
                        href={externalUrls.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        ウェブサイト
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSaveExternalUrls} disabled={savingUrls} className="gap-2">
                  <Save className="w-4 h-4" />
                  {savingUrls ? '保存中...' : '保存'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ポートフォリオ管理</CardTitle>
                  <CardDescription className="mt-2">
                    あなたの作品を登録・管理できます
                  </CardDescription>
                </div>
                <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  作品を追加
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {portfolios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="overflow-hidden">
                      <div className="aspect-square relative group">
                        <img
                          src={portfolio.imageUrl}
                          alt={portfolio.title || 'Portfolio image'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePortfolio(portfolio)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            削除
                          </Button>
                        </div>
                      </div>
                      {(portfolio.title || portfolio.description) && (
                        <CardContent className="p-4">
                          {portfolio.title && (
                            <h3 className="font-semibold mb-1">{portfolio.title}</h3>
                          )}
                          {portfolio.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {portfolio.description}
                            </p>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    まだポートフォリオがありません
                  </p>
                  <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    最初の作品を追加
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Portfolio Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>作品を追加</DialogTitle>
            <DialogDescription>
              ポートフォリオに追加する作品をアップロードしてください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">画像 *</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {newPortfolio.preview ? (
                  <div className="relative">
                    <img
                      src={newPortfolio.preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setNewPortfolio(prev => ({ ...prev, file: null, preview: null }))}
                    >
                      削除
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="image" className="cursor-pointer">
                      <span className="text-blue-600 hover:underline">
                        クリックして画像を選択
                      </span>
                    </Label>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">タイトル（任意）</Label>
              <Input
                id="title"
                value={newPortfolio.title}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                placeholder="作品のタイトル"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明（任意）</Label>
              <Textarea
                id="description"
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                placeholder="作品の説明"
                rows={3}
                disabled={uploading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewPortfolio({ title: '', description: '', file: null, preview: null });
                setAddDialogOpen(false);
              }}
              disabled={uploading}
            >
              キャンセル
            </Button>
            <Button onClick={handleAddPortfolio} disabled={uploading || !newPortfolio.file}>
              {uploading ? 'アップロード中...' : '追加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

