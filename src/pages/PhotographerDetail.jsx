import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Camera, Star, MessageCircle, ArrowLeft, Instagram, Twitter, Globe, ExternalLink, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioGallery } from '@/components/photographer/PortfolioGallery';
import { ReviewsList } from '@/components/photographer/ReviewsList';
import { mockAuthService } from '@/services/mockAuthService';
import { mockAPIService } from '@/services/mockAPIService';
import { mockStorageService } from '@/services/mockStorageService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';

export function PhotographerDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const photographer = location.state?.photographer;
  
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!photographer) {
      navigate('/home-for-register');
      return;
    }
    
    loadData();
  }, [photographer]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get current user
      if (useMock) {
        const user = await mockAuthService.getCurrentUser();
        setCurrentUser(user);
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const user = await getCurrentUser();
        setCurrentUser(user);
      }

      // Load profile image
      if (photographer.profile_image) {
        if (useMock) {
          const url = await mockStorageService.getImageUrl(photographer.profile_image);
          setProfileImageUrl(url);
        } else {
          const { getUrl } = await import('aws-amplify/storage');
          const result = await getUrl({ key: photographer.profile_image });
          setProfileImageUrl(result.url.href);
        }
      }

      // Load portfolios
      if (useMock) {
        const portfolioResult = await mockAPIService.mockListPortfolios(photographer.id);
        setPortfolios(portfolioResult.items);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const portfolioResult = await client.graphql({
          query: queries.listPortfolios,
          variables: { photographer_id: photographer.id }
        });
        setPortfolios(portfolioResult.data.listPortfolios.items);
      }

      // Load reviews
      if (useMock) {
        const reviewResult = await mockAPIService.mockListReviews(photographer.id);
        setReviews(reviewResult.items);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        const reviewResult = await client.graphql({
          query: queries.listReviews,
          variables: { reviewee_id: photographer.id }
        });
        setReviews(reviewResult.data.listReviews.items);
      }
    } catch (error) {
      console.error('Load photographer detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = async () => {
    if (!currentUser) {
      navigate('/home-for-non-register');
      return;
    }

    try {
      // Create or get conversation
      let conversation;
      if (useMock) {
        conversation = await mockAPIService.mockGetOrCreateConversation(
          currentUser.userId,
          photographer.id
        );
      } else {
        // AWS implementation would go here
        console.log('Create conversation with AWS');
      }

      navigate(`/messages/${currentUser.userId}/${photographer.id}`);
    } catch (error) {
      console.error('Contact error:', error);
    }
  };

  const averageRating = photographer.averageRating || 0;
  const reviewCount = photographer.reviewCount || reviews.length;
  
  // 自分自身かどうかをチェック
  const isOwnProfile = currentUser && (
    currentUser.userId === photographer.id || 
    currentUser.sub === photographer.id
  );

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <Avatar className="w-32 h-32 mx-auto md:mx-0">
                  <AvatarImage src={profileImageUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-4xl">
                    {photographer.nickname?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {photographer.nickname || 'フォトグラファー'}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {photographer.prefecture && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{photographer.prefecture}</span>
                      </div>
                    )}

                    {averageRating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ({reviewCount}件のレビュー)
                        </span>
                      </div>
                    )}
                  </div>

                  {photographer.genres && photographer.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {photographer.genres.map((genre, i) => (
                        <Badge key={i} variant="secondary">
                          <Camera className="w-3 h-3 mr-1" />
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {photographer.bio && (
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {photographer.bio}
                    </p>
                  )}

                  {/* External Portfolio Links */}
                  {(photographer.instagram_url || photographer.twitter_url || photographer.website_url) && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">外部ポートフォリオ</h3>
                      <div className="flex flex-wrap gap-3">
                        {photographer.instagram_url && (
                          <a
                            href={photographer.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            <Instagram className="w-4 h-4" />
                            <span className="text-sm font-medium">Instagram</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {photographer.twitter_url && (
                          <a
                            href={photographer.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                          >
                            <Twitter className="w-4 h-4" />
                            <span className="text-sm font-medium">Twitter</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {photographer.website_url && (
                          <a
                            href={photographer.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
                          >
                            <Globe className="w-4 h-4" />
                            <span className="text-sm font-medium">ウェブサイト</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rate Information */}
                  {(photographer.minimum_rate || photographer.rate_details) && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">料金情報</h3>
                      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                        <CardContent className="p-6">
                          {photographer.minimum_rate && (
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-blue-600 text-white p-2 rounded-lg">
                                <DollarSign className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">最低料金</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  ¥{photographer.minimum_rate.toLocaleString()}
                                  <span className="text-base font-normal text-muted-foreground ml-1">
                                    〜 / 1時間
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {photographer.rate_details && (
                            <div className="pt-4 border-t border-blue-100">
                              <p className="text-sm font-semibold text-muted-foreground mb-2">料金詳細</p>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {photographer.rate_details}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {!isOwnProfile && (
                    <Button onClick={handleContactClick} size="lg" className="gap-2">
                      <MessageCircle className="w-5 h-5" />
                      メッセージを送る
                    </Button>
                  )}
                  
                  {isOwnProfile && (
                    <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                      これはあなたのプロフィールです
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList>
              <TabsTrigger value="portfolio">
                ポートフォリオ ({portfolios.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                レビュー ({reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <Card>
                <CardContent className="p-6">
                  <PortfolioGallery portfolios={portfolios} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsList reviews={reviews} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

