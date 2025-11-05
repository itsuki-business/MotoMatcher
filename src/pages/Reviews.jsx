import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewsList } from '@/components/photographer/ReviewsList';
import { mockAuthService } from '@/services/mockAuthService';
import { mockAPIService } from '@/services/mockAPIService';
import { useMock } from '@/config/environment';
import * as queries from '@/graphql/queries';

export function Reviews() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    reviewCount: 0
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);

      let currentUser;
      if (useMock) {
        currentUser = await mockAuthService.getCurrentUser();
      } else {
        const { getCurrentUser } = await import('aws-amplify/auth');
        currentUser = await getCurrentUser();
      }

      if (!currentUser) {
        navigate('/home-for-non-register');
        return;
      }

      const userId = currentUser.userId || currentUser.sub;

      // Load reviews
      if (useMock) {
        const result = await mockAPIService.mockListReviews(userId);
        setReviews(result.items);

        const ratingResult = await mockAPIService.mockGetAverageRating(userId);
        setStats(ratingResult);
      } else {
        const { generateClient } = await import('aws-amplify/api');
        const client = generateClient();
        
        const result = await client.graphql({
          query: queries.listReviews,
          variables: { reviewee_id: userId }
        });
        setReviews(result.data.listReviews.items);

        // Calculate stats
        const items = result.data.listReviews.items;
        if (items.length > 0) {
          const sum = items.reduce((acc, r) => acc + r.rating, 0);
          setStats({
            averageRating: Number((sum / items.length).toFixed(1)),
            reviewCount: items.length
          });
        }
      }
    } catch (error) {
      console.error('Load reviews error:', error);
    } finally {
      setLoading(false);
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
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">レビュー</h1>
            <p className="text-muted-foreground">
              あなたに対する評価とフィードバック
            </p>
          </div>

          {stats.reviewCount > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                      <span className="text-4xl font-bold">
                        {stats.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      平均評価
                    </p>
                  </div>

                  <div className="h-16 w-px bg-border" />

                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {stats.reviewCount}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      レビュー数
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <ReviewsList reviews={reviews} />
        </motion.div>
      </div>
    </div>
  );
}

